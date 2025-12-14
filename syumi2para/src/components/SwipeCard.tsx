import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import type { Hobby } from '../types/types'; // Hobby型を使用

// SwipeCardPropsからonSwipeは削除されます（親コンポーネントでスワイプを処理するため）
interface DisplayCardProps {
  hobby: Hobby;
}

// ボタンを削除し、純粋に趣味を表示するカードに
const SwipeCard: React.FC<DisplayCardProps> = ({ hobby }) => {
  return (
    // Cardの高さと幅を調整し、スワイプ時の見栄えを良くする
    <Card 
      sx={{ 
        maxWidth: 345, 
        width: '100%',
        height: 500, // 高さを少し上げる
        borderRadius: 4, // 角を丸くする
        boxShadow: 8,
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <CardMedia
        component="img"
        height="300" // 画像エリアを拡大
        image={hobby.imageUrl || 'https://via.placeholder.com/345x300?text=Hobby+Image'}
        alt={hobby.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1, textAlign: 'left', p: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {hobby.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hobby.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SwipeCard;