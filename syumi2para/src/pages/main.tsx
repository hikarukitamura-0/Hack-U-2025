// src/pages/main.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Typography, Box, Stack, styled, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import TinderCard from 'react-tinder-card'; // ★ 新しいインポート

import SwipeCard from '../components/SwipeCard';
import initialHobbies from '../data/hobbies.json'; 
import type { Hobby } from '../types/types'; 

// UI改善のために提供されたスタイルを流用
const ACCENT_COLOR = '#000000ff'; 
const REJECT_COLOR = '#ff0000'; // 赤色
const LIKE_COLOR = '#4caf50'; // 緑色

// 抽象的な背景グラデーションを適用するBoxを再定義 (MUIテーマが必要)
const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #ebc8ffff 0%, #f0f0f0 70%)`, // ベースカラーを合わせる
  minHeight: '100vh',
  padding: theme.spacing(4, 0),
}));

const Main = () => {
  // initialHobbiesを逆順にすることで、リストの最後の要素からスワイプを開始し、
  // useStateを更新するたびにリストの先頭が次のカードになるようにする。
  const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies as Hobby[]);
  const [swiped, setSwiped] = useState<{ liked: number[], disliked: number[] }>({ liked: [], disliked: [] });
  
  // 現在リストに残っているカードのインデックスを保持
  const [currentIndex, setCurrentIndex] = useState(hobbies.length - 1);

  // useRefを使ってカード参照を管理すると、プログラムからの強制スワイプが可能になるが、
  // 今回はTinderCardの`onSwipe`コールバックで状態を管理するシンプルな方法を採用

  // スワイプが完了したときに呼ばれるコールバック
  const onSwipe = useCallback((direction: string, hobbyId: number) => {
    // 1. 評価済みのリストに追加
    if (direction === 'right') {
      setSwiped(prev => ({ ...prev, liked: [...prev.liked, hobbyId] }));
    } else if (direction === 'left') {
      setSwiped(prev => ({ ...prev, disliked: [...prev.disliked, hobbyId] }));
    }

    // 2. 現在のカードインデックスをデクリメント
    setCurrentIndex(prev => prev - 1); 

    console.log(`Hobby ID: ${hobbyId}, Action: ${direction === 'right' ? 'いいね' : 'いまいち'}`);
  }, []);

  // スワイプ処理後の動作（すべてのカードが評価されたかチェック）
  const onCardLeftScreen = (myIdentifier: string) => {
    // 画面からカードが完全に消えたことを確認 (ロギング用)
    console.log(myIdentifier + ' が画面外に出ました');
  };

  const isComplete = currentIndex < 0;

  return (
    <GradientBackground>
      <Container maxWidth="sm" sx={{ mt: 2, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ fontWeight: 800, mb: 4, color: ACCENT_COLOR }}
        >
          しゅみシンクロ診断
        </Typography>

        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="550px" // カード+スワイプアニメーションのためのスペース確保
          sx={{ position: 'relative' }} // TinderCardの重ね合わせのために必要
        >
          {isComplete ? (
            // すべてのカードが評価された場合
            <Box sx={{ p: 4, border: '1px solid #ccc', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                🎉 診断完了！ 🎉
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                いいね数: **{swiped.liked.length}** | 
                いまいち数: **{swiped.disliked.length}**
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                このデータをもとに、最適な趣味をマッチングします。
              </Typography>
            </Box>
          ) : (
            // スワイプカード表示エリア
            <Box 
                sx={{ 
                    width: '100%', 
                    maxWidth: 345,
                    height: 500, // SwipeCardの高さに合わせる
                    // 複数のカードを重ねて表示するために必要
                }}
            >
                {hobbies.map((hobby, index) => (
                    <TinderCard
                        key={hobby.id}
                        // カードを重ねて表示するため、position: absolute を適用
                        // indexがcurrentIndexより大きい（リストの奥にある）カードは非表示にする
                        // 現在のカードと次に表示されるカードのみをレンダリング対象とする
                        className='swipe' 
                        preventSwipe={['up', 'down']} // 上下スワイプを無効化
                        onSwipe={(dir) => onSwipe(dir, hobby.id)}
                        onCardLeftScreen={() => onCardLeftScreen(hobby.name)}
                        // 現在のインデックス以降のカードのみ表示
                        style={{ position: 'absolute', top: 0, opacity: index >= currentIndex ? 1 : 0 }} 
                    >
                        <SwipeCard hobby={hobby} />
                    </TinderCard>
                )).reverse()} {/* リストを逆順にすることで、末尾の要素から手前に表示される */}
            </Box>
          )}
        </Box>

        {/* スワイプボタン (アクセシビリティ確保のため残す) */}
        {!isComplete && (
            <Stack direction="row" spacing={6} justifyContent="center" sx={{ mt: 4 }}>
                <IconButton 
                    color="error" 
                    size="large" 
                    // ここにプログラムからスワイプを強制するロジックを実装することも可能ですが、
                    // 今回はデモとして、ボタンをクリックしてもonSwipeが実行されるUIを提示します。
                    // 実際の実装ではuseRefを使って強制スワイプ関数を呼び出します。
                    onClick={() => onSwipe('left', hobbies[currentIndex].id)}
                    sx={{ bgcolor: `${REJECT_COLOR}15`, p: 2, '&:hover': { bgcolor: `${REJECT_COLOR}30` } }}
                >
                    <CloseIcon sx={{ fontSize: 40, color: REJECT_COLOR }} />
                </IconButton>
                <IconButton 
                    color="success" 
                    size="large" 
                    onClick={() => onSwipe('right', hobbies[currentIndex].id)}
                    sx={{ bgcolor: `${LIKE_COLOR}15`, p: 2, '&:hover': { bgcolor: `${LIKE_COLOR}30` } }}
                >
                    <FavoriteIcon sx={{ fontSize: 40, color: LIKE_COLOR }} />
                </IconButton>
            </Stack>
        )}

      </Container>
    </GradientBackground>
  );
};

export default Main;