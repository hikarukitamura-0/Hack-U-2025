// V1 APIを明示的にインポートします
import * as functionsV1 from 'firebase-functions/v1'; 
import * as admin from 'firebase-admin';

// Firestoreトリガーの型定義をインポートしたV1 APIから取得
type DocumentSnapshot = functionsV1.firestore.DocumentSnapshot;
type EventContext = functionsV1.EventContext; 

admin.initializeApp();
const db = admin.firestore();

/**
 * [Cloud Function] onNewSwipeCheckMatch
 * swipesコレクションに新しいLIKEが作成された際にトリガーされ、
 * 相互 LIKE であればマッチングを成立させる。
 */
export const onNewSwipeCheckMatch = functionsV1 // V1 APIの関数を使用
  .firestore.document('swipes/{swipeId}')
  // onCreateの引数に明示的に型を付与してエラーを解消
  .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => { 
    
    // データの読み込み（型アサーションを追加）
    const newSwipe = snapshot.data() as FirebaseFirestore.DocumentData;
    const swiperUid = newSwipe.swiper_uid as string; // アクションを実行したユーザー (自分)
    const swipedUid = newSwipe.swiped_uid as string; // アクションの対象となったユーザー (相手)
    const action = newSwipe.action as string; // アクションの種類

    // 1. 処理のフィルタリング: 'LIKE' でない場合は終了
    if (action !== 'LIKE') {
      return null;
    }

    // 2. 相互 LIKE のチェック (相手が自分に LIKE しているか)
    const mutualLikeQuery = await db.collection('swipes')
      .where('swiper_uid', '==', swipedUid) 
      .where('swiped_uid', '==', swiperUid) 
      .where('action', '==', 'LIKE')
      .limit(1)
      .get();

    // 3. マッチング不成立
    if (mutualLikeQuery.empty) {
      console.log(`Mutual LIKE not found for ${swiperUid} and ${swipedUid}.`);
      return null;
    }

    // --- マッチング成立後の処理 (トランザクション処理) ---

    // 4. マッチIDの決定と重複チェック
    const [userA, userB] = [swiperUid, swipedUid].sort();
    const matchId = `${userA}_${userB}`;

    const matchRef = db.collection('matches').doc(matchId);

    // 5. 共通趣味の計算とデータ取得
    const [userADoc, userBDoc] = await Promise.all([
      db.collection('users').doc(userA).get(),
      db.collection('users').doc(userB).get(),
    ]);
    
    // ユーザーが存在しない場合を考慮
    const hobbiesA = userADoc.data()?.selected_hobbies || [];
    const hobbiesB = userBDoc.data()?.selected_hobbies || [];

    // 共通趣味のIDを抽出
    const commonHobbies = hobbiesA.filter((hobby: string) => hobbiesB.includes(hobby));
    
    // 6. matches コレクションへの書き込み（トランザクション）
    try {
      await db.runTransaction(async (transaction) => {
        // トランザクション内で重複がないことを最終確認
        const checkMatch = await transaction.get(matchRef);
        if (checkMatch.exists) {
          console.log('Match already confirmed in transaction.');
          return;
        }
        
        const matchData = {
          user_a_uid: userA,
          user_b_uid: userB,
          timestamp_matched: admin.firestore.FieldValue.serverTimestamp(),
          common_hobbies: commonHobbies,
        };

        // matches コレクションに書き込み
        transaction.set(matchRef, matchData);
        
        // (オプション) chats コレクションにチャットルームを初期化
        transaction.set(db.collection('chats').doc(matchId), {
          users: [userA, userB],
          timestamp_created: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
    } catch (error) {
        console.error("Transaction failed: ", error);
        return null;
    }

    console.log(`🎉 Match successful: ${matchId}`);
    return null;

  });