import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Divider,
} from '@mui/material';
import {
  Palette
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// カスタムカラー定義 (元のスタイルを踏襲しつつ、主にアクセントに使用)
const ACCENT_COLOR = '#000000ff'; // メインカラー（ブラック）
const HOVER_COLOR = '#d21dffff';  // アクセントカラー（マゼンタ/パープル）

// 1. クリーンな背景スタイル
const CleanBackground = styled(Box)(({ theme }) => ({
  // 背景を純粋な白に設定し、洗練された印象に
  background: theme.palette.mode === 'dark' ? '#121212' : '#ffffff', 
  minHeight: '100vh',
  padding: theme.spacing(4, 0), 
}));

// 2. セクションタイトルのスタイル (モダンでシャープなデザイン)
const SectionTitleStyle = {
  fontWeight: 800,
  fontSize: '1.8rem', // 大きめのフォントでインパクトを出す
  mb: 1, // タイトルとサブ要素の距離を詰める
  color: ACCENT_COLOR,
};

// 詳細データの定義
const aisyouData = {
  name: "UI/UXデザイン",
  icon: <Palette sx={{ fontSize: 60, color: ACCENT_COLOR }} />,
  message: "これが運命の赤い糸か！！"
};

const Aisyou: React.FC = () => {
  return (
    <CleanBackground>
      {/* ContainerをmaxWidth="sm"に戻し、スマホでは適度な余白を確保 */}
      <Container maxWidth="sm" sx={{ p: { xs: 3, sm: 4 } }}> 
        <Stack spacing={3}>
          
          {/* 1. タイトル */}
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            <Typography variant="h4" sx={SectionTitleStyle}>
              しゅみ相性レベル
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ fontWeight: 400, mb: 3, fontSize: { xs: '1rem', sm: '1.2rem' },  }}
            >
              相性を理解し、<br/>
              あなたの能力をよりHackする。
            </Typography>
            <Divider sx={{ bgcolor: ACCENT_COLOR, height: '1px', width: '30%', mx: 'auto', mt: 6 }} />
          </Box>

          {/* 1. タイトル */}
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            {aisyouData.icon}
            <Typography variant="h4" sx={SectionTitleStyle}>
              {aisyouData.name}
              と<br/>
              あなたの相性
            </Typography>
            <Typography variant="h1" component="h1" sx={{ fontWeight: 900, color: HOVER_COLOR, mt: 5, mb: 0.5 }}>
              {/* ===============相性計算結果をここに入れる！！！=============== */}
              ％
            </Typography>
          </Box>

          {/* 2. 相性コメント */}
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ fontWeight: 400, mb: 3, fontSize: { xs: '1rem', sm: '1.2rem' },  }}
            >
              {aisyouData.message}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </CleanBackground>
  );
};

export default Aisyou;