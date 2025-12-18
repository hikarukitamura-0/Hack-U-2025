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
exports.getHobbySyncRate = exports.onNewSwipeCheckMatch = void 0;
const functionsV1 = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
/**
 * [1] マッチング機能
 * onNewSwipeCheckMatch
 * swipesコレクションに新しいLIKEが作成された際にトリガーされ、相互LIKEならマッチング成立。
 */
exports.onNewSwipeCheckMatch = functionsV1
    .firestore.document('swipes/{swipeId}')
    .onCreate(async (snapshot, context) => {
    const newSwipe = snapshot.data();
    const swiperUid = newSwipe.swiper_uid;
    const swipedUid = newSwipe.swiped_uid;
    const action = newSwipe.action;
    if (action !== 'LIKE')
        return null;
    // 相互LIKEチェック
    const mutualLikeQuery = await db.collection('swipes')
        .where('swiper_uid', '==', swipedUid)
        .where('swiped_uid', '==', swiperUid)
        .where('action', '==', 'LIKE')
        .limit(1)
        .get();
    if (mutualLikeQuery.empty) {
        console.log(`Mutual LIKE not found for ${swiperUid} and ${swipedUid}.`);
        return null;
    }
    // マッチング成立処理
    const [userA, userB] = [swiperUid, swipedUid].sort();
    const matchId = `${userA}_${userB}`;
    const matchRef = db.collection('matches').doc(matchId);
    const [userADoc, userBDoc] = await Promise.all([
        db.collection('users').doc(userA).get(),
        db.collection('users').doc(userB).get(),
    ]);
    const hobbiesA = userADoc.data()?.selected_hobbies || [];
    const hobbiesB = userBDoc.data()?.selected_hobbies || [];
    const commonHobbies = hobbiesA.filter((hobby) => hobbiesB.includes(hobby));
    try {
        await db.runTransaction(async (transaction) => {
            const checkMatch = await transaction.get(matchRef);
            if (checkMatch.exists)
                return;
            transaction.set(matchRef, {
                user_a_uid: userA,
                user_b_uid: userB,
                timestamp_matched: admin.firestore.FieldValue.serverTimestamp(),
                common_hobbies: commonHobbies,
            });
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
/**
 * [2] シンクロ率計算機能 (これがないと動きません！)
 * getHobbySyncRate
 * フロントエンドから呼び出され、ユーザーの好みと趣味のデータを比較してスコアを返す。
 */
exports.getHobbySyncRate = functionsV1.https.onCall(async (data, context) => {
    // 1. 認証チェック
    if (!context.auth) {
        return { syncRate: 50, reason: "ログインが必要です" };
    }
    const { hobbyId } = data; // フロントから送られてきた趣味ID
    const uid = context.auth.uid;
    try {
        // 2. データの取得
        // hobbyIdをStringに変換して、IDが数値でも文字列でもヒットするようにする
        const [userDoc, hobbyDoc] = await Promise.all([
            db.collection('users').doc(uid).get(),
            db.collection('hobbies').doc(String(hobbyId)).get()
        ]);
        const userData = userDoc.data();
        const hobbyData = hobbyDoc.data();
        // データがない場合のデフォルト値
        if (!userData)
            return { syncRate: 50, reason: "プロフィール設定がまだのようです。" };
        if (!hobbyData)
            return { syncRate: 50, reason: "趣味データが見つかりません。" };
        let score = 60; // 基本スコア
        let reason = "未知の可能性を秘めています。";
        // 3. ロジック判定
        const genre = userData.game_genre; // "puzzle", "fps", "rpg"
        const category = hobbyData.category_id; // "digital_tech", "creative", etc...
        // --- パズル好きの判定 ---
        if (genre === 'puzzle') {
            if (category === 'digital_tech' || category === 'knowledge') {
                score += 30;
                reason = "論理的思考を好むあなたに、構造をハックする楽しさを約束します。";
            }
        }
        // --- FPS好きの判定 ---
        else if (genre === 'fps') {
            if (category === 'exploration' || category === 'digital_tech') {
                score += 25;
                reason = "瞬時の判断と効率を愛するあなたに、最高の没入感を提供します。";
            }
        }
        // --- RPG好きの判定 ---
        else if (genre === 'rpg') {
            if (category === 'creative' || category === 'community') {
                score += 25;
                reason = "世界観を作り込み、物語を紡ぐ楽しさがここにあります。";
            }
        }
        // 4. ランダムな揺らぎ (最大99%)
        const drift = Math.floor(Math.random() * 5);
        const finalRate = Math.min(score + drift, 99);
        return {
            syncRate: finalRate,
            reason: reason
        };
    }
    catch (error) {
        console.error("計算エラー:", error);
        return { syncRate: 50, reason: "計算中にエラーが発生しました" };
    }
});
//# sourceMappingURL=index.js.map