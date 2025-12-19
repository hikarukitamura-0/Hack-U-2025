import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface SwipeCardProps {
  question: {
    id: number;
    text: string;
  };
}

const SwipeCard: React.FC<SwipeCardProps> = ({ question }) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        width: '100%',
        height: 500, 
        borderRadius: 6, // 少し丸みを強めてモダンに
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#ffffff',
        border: '1px solid #f0f0f0'
      }}
    >
      {/* カード上部：質問番号のヘッダー */}
      <Box 
        sx={{ 
          height: '180px', 
          bgcolor: '#000000', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#ffffff',
          position: 'relative'
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 2, opacity: 0.9 }}>
          QUESTION
        </Typography>
        <Typography 
          variant="h1" 
          sx={{ 
            position: 'absolute', 
            bottom: -20, 
            right: 10, 
            fontSize: '8rem', 
            fontWeight: 900, 
            opacity: 0.1, 
            color: '#fff' 
          }}
        >
          {question.id}
        </Typography>
      </Box>
      
      {/* カード下部：質問文メインエリア */}
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center', 
          p: 4 
        }}
      >
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 800, 
            lineHeight: 1.6, 
            color: '#000000',
            wordBreak: 'keep-all', // 日本語の不自然な改行を防ぐ
          }}
        >
          {question.text}
        </Typography>
        
        <Divider sx={{ my: 3, width: '40px', height: '3px', bgcolor: '#d21dff', borderRadius: 1 }} />
        
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          直感で「はい」か「いいえ」を選んでください
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SwipeCard;