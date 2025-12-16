import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Divider,
} from '@mui/material';
import {
  Palette,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// カスタムカラー定義 (元のスタイルを踏襲しつつ、主にアクセントに使用)
const ACCENT_COLOR = '#000000ff'; // メインカラー（ブラック）
//const HOVER_COLOR = '#d21dffff';  // アクセントカラー（マゼンタ/パープル）

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
  mt: 6, 
  mb: 1, // タイトルとサブ要素の距離を詰める
  color: ACCENT_COLOR,
};

// 詳細データの定義
const aisyouData = {
  name: "UI/UXデザイン",
  icon: <Palette sx={{ fontSize: 60, color: ACCENT_COLOR }} />,
};

const Aisyou: React.FC = () => {
  return (
    <CleanBackground>
      {/* ContainerをmaxWidth="sm"に戻し、スマホでは適度な余白を確保 */}
      <Container maxWidth="sm" sx={{ p: { xs: 3, sm: 4 } }}> 
        <Stack spacing={8}>
          
          {/* 1. タイトル */}
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            {aisyouData.icon}
            <Typography variant="h4" sx={SectionTitleStyle}>
              {aisyouData.name}とあなたの相性
            </Typography>
            <Divider sx={{ bgcolor: ACCENT_COLOR, height: '1px', width: '30%', mx: 'auto', mt: 3 }} />
          </Box>
        </Stack>
      </Container>
    </CleanBackground>
  );
};

export default Aisyou;