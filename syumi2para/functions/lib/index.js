"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNewSwipeCheckMatch = void 0;
// V1 APIを明示的にインポートします
const functionsV1 = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
/**
 * [Cloud Function] onNewSwipeCheckMatch
 * swipesコレクションに新しいLIKEが作成された際にトリガーされ、
 * 相互 LIKE であればマッチングを成立させる。
 */
exports.onNewSwipeCheckMatch = functionsV1 // V1 APIの関数を使用
    .firestore.document('swipes/{swipeId}')
    // onCreateの引数に明示的に型を付与してエラーを解消
    .onCreate(async (snapshot, context) => {
    // データの読み込み（型アサーションを追加）
    const newSwipe = snapshot.data();
    const swiperUid = newSwipe.swiper_uid; // アクションを実行したユーザー (自分)
    const swipedUid = newSwipe.swiped_uid; // アクションの対象となったユーザー (相手)
    const action = newSwipe.action; // アクションの種類
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
    const commonHobbies = hobbiesA.filter((hobby) => hobbiesB.includes(hobby));
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
    }
    catch (error) {
        console.error("Transaction failed: ", error);
        return null;
    }
    console.log(`🎉 Match successful: ${matchId}`);
    return null;
});
//# sourceMappingURL=index.js.map