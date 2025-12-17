import React from 'react';
import { useNavigate } from 'react-router-dom'; // 診断ページへ飛ばすために必要
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Chip,
  styled,
  Divider 
} from '@mui/material';
import {
  AutoAwesome, 
  Code, 
  Palette, 
  Hiking, 
  Lightbulb
} from '@mui/icons-material';
import logo from '../assets/logo_main.png';
import lets from '../assets/lets_modan.png';

// --- スタイル定義 ---
const ACCENT_COLOR = '#000000'; 
const HOVER_COLOR = '#d21dff';
const MONO_COLOR = 'black';

const DescriptionStyle = {
  fontWeight: 400,
  fontSize: { xs: '1rem', sm: '1.2rem' },
  color: 'text.secondary', 
};

const HeadlineStyle = {
  fontWeight: 800,
  fontSize: { xs: '1.8rem', sm: '3rem' }, 
  lineHeight: 1.2,
  mb: 3,
  color: MONO_COLOR,
};

// 背景グラデーション
const GradientBackground = styled(Box)({
  background: `linear-gradient(135deg, #ebc8ff 0%, #ffffff 70%)`,
  minHeight: '100vh',
  padding: '32px 0',
});

// 適性タグ
const hobbyCategories = [
  { name: 'ロジカル（パズル/戦略）', icon: <Code sx={{ fontSize: 18 }} /> },
  { name: 'クリエイティブ（創作）', icon: <Palette sx={{ fontSize: 18 }} /> },
  { name: 'アクティブ（社会性/外向）', icon: <Hiking sx={{ fontSize: 18 }} /> },
  { name: 'インテリジェンス（知識）', icon: <Lightbulb sx={{ fontSize: 18 }} /> },
];

const Home: React.FC = () => {
  const navigate = useNavigate(); // navigate関数を初期化

  // 診断ページ(/main)へ遷移する関数
  const startDiagnosis = () => {
    navigate('/main');
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <Stack spacing={8}>
          
          {/* 1. ロゴセクション */}
          <Box sx={{ textAlign: 'center', pt: 4 }}>
            <Box sx={{ my: 4 }}>
              <img src={logo} alt='しゅみしゅみぱらだいす' style={{ width: '300px', maxWidth: '80%' }} />
              <img src={lets} alt='Let`s Shumi!Shumi!' style={{ width: '320px', maxWidth: '85%', display: 'block', margin: '10px auto' }} />
            </Box>
          </Box>

          {/* 2. キャッチコピーと開始ボタン */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.5rem' }, mb: 3 }}>
              「ただ日々を貪る高専生」<br/>↓<br/>「高専生のあるべき姿へ」
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, fontSize: '1.1rem' }}>
              マチアプ感覚の直感スワイプで、<br/>ベストな「しゅみ」を見つけよう。
            </Typography>
            
            {/* ★ 修正ポイント：onClickで診断ページへ飛ばす */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={startDiagnosis} 
              sx={{ 
                py: 2, px: 6, fontWeight: 700, borderRadius: 10, 
                backgroundColor: ACCENT_COLOR, color: '#fff',
                '&:hover': { backgroundColor: HOVER_COLOR }
              }}
            >
              しゅみシンクロ診断を始める
            </Button>
          </Box>

          <Divider sx={{ borderBottomWidth: 1.5 }} />

          {/* 3. 煽り・説明セクション */}
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
              「脳死で無気力」な日々が、<br/>君の人生のハイライト。
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left', color: 'text.secondary', lineHeight: 1.8, mb: 6 }}>
              一日中ベッドから動かなかった君の「忍耐力」は、長時間作業を要する創作活動でこそ活きる。<br/>
              FPSで培った「論理的思考」は、それ以外の場所で輝くべきだ。<br/>
              このままじゃ、老後に流れる走馬灯が本当にクソみたいになるぞ。
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 800, color: ACCENT_COLOR, mb: 4 }}>
              そのままでいいのか？舞鶴高専生よ。
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={startDiagnosis} 
              sx={{ 
                py: 2, px: 6, fontWeight: 700, borderRadius: 10, 
                backgroundColor: ACCENT_COLOR,
                '&:hover': { backgroundColor: HOVER_COLOR }
              }}
            >
              言い訳を捨てて、診断を始める
            </Button>
          </Box>

          {/* 4. タグ検索風セクション */}
          <Box sx={{ pt: 4, pb: 8, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>適性タグから探す</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
              {hobbyCategories.map((cat) => (
                <Chip
                  key={cat.name}
                  label={cat.name}
                  icon={cat.icon}
                  onClick={startDiagnosis}
                  variant="outlined"
                  sx={{ py: 3, px: 1, borderRadius: 2, fontWeight: 600, borderColor: ACCENT_COLOR }}
                />
              ))}
            </Box>
          </Box>

        </Stack>
      </Container>
    </GradientBackground>
  );
};

export default Home;