import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Chip,
  styled,
  useTheme,
} from '@mui/material';
import { AutoAwesome, Code, Palette, Hiking, Lightbulb } from '@mui/icons-material';

// 暖色系のカスタムテーマカラーを定義 (MUIのテーマ設定をオーバーライドする想定)
// ここではカスタムカラーを直接定義します
const WARM_ACCENT_COLOR = '#FF8A65'; // テラコッタ/濃いアプリコット
const WARM_HOVER_COLOR = '#E67A5A';

// 抽象的な背景グラデーションを適用するBox
const GradientBackground = styled(Box)(({ theme }) => ({
  // #FADA7A (明るいアプリコット) を基点とし、白へフェードアウトする暖色系グラデーション
  background: `linear-gradient(135deg, #FADA7A 0%, ${theme.palette.background.default} 70%)`,
  minHeight: '100vh',
  padding: theme.spacing(4, 0),
}));

// ダミーの趣味カテゴリ (適性タグを意識)
const hobbyCategories = [
  { name: 'ロジカル（パズル/戦略）', icon: <Code sx={{ fontSize: 18 }} /> },
  { name: 'クリエイティブ（創作）', icon: <Palette sx={{ fontSize: 18 }} /> },
  { name: 'アクティブ（社会性/外向）', icon: <Hiking sx={{ fontSize: 18 }} /> },
  { name: 'インテリジェンス（知識）', icon: <Lightbulb sx={{ fontSize: 18 }} /> },
];

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <GradientBackground>
      {/* 画面中央に配置するコンテンツコンテナ (スマホサイズを想定) */}
      <Container maxWidth="sm">
        <Stack spacing={8}>
          {/* 1. タイトルロゴ (ミニマルな構成) */}
          <Box sx={{ textAlign: 'center', pt: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              color="text.primary"
              // 極細のフォントウェイトで高級感を演出
              sx={{ fontWeight: 300, letterSpacing: 4, opacity: 0.9 }}
            >
              ShumiShumi Paradise
            </Typography>
          </Box>

          {/* 2. ファーストビュー：強いキャッチコピーとメインCTA */}
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography
              variant="h2"
              component="p"
              // 大見出しは極めて太く、余白を大胆に使用
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem' },
                lineHeight: 1.2,
                mb: 3,
                color: '#000000ff'
              }}
            >
              {'「非生産的な毎日」'}
              <br/>
              {'↓'}
              <br/>
              {'「未来への投資」'}
              
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ fontWeight: 400, mb: 6 }}
            >
              マチアプ感覚の直感スワイプで、適性の高い新しい活動を見つけよう。
            </Typography>

            {/* 行動ボタンは1つだけ、暖色系のアクセントカラーを適用 */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              // ここにスワイプ画面への遷移ロジックを実装
              onClick={() => console.log('スワイプ開始')} 
              sx={{ 
                py: 2, 
                px: 6,
                fontWeight: 700, 
                borderRadius: 4, 
                // 暖色系のアクセントカラーを適用
                backgroundColor: WARM_ACCENT_COLOR,
                '&:hover': {
                  backgroundColor: WARM_HOVER_COLOR,
                }
              }}
            >
              趣味シンクロ診断を始める
            </Button>
          </Box>

          {/* 3. カテゴリ別検索セクション */}
          <Box sx={{ pt: 4, textAlign: 'left' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 3, 
                textAlign: 'center',
                color: 'text.primary'
              }}
            >
            適性タグから探す
            </Typography>
            
            {/* FlexBoxとBoxを使用してカテゴリチップを配置 */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center', 
                gap: 1.5, 
              }}
            >
              {hobbyCategories.map((category) => (
                <Box key={category.name}>
                  <Chip
                    label={category.name}
                    icon={category.icon}
                    variant="outlined"
                    // チップの枠線も暖色系で統一感を出す
                    sx={{ 
                      px: 1, 
                      py: 3,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderRadius: 2, 
                      borderColor: WARM_ACCENT_COLOR,
                      color: WARM_ACCENT_COLOR,
                      '&:hover': {
                        backgroundColor: `${WARM_ACCENT_COLOR}15`,
                      }
                    }}
                    // ここにカテゴリ検索ロジックを実装
                    onClick={() => console.log(`${category.name}で検索`)}
                  />
                </Box>
              ))}
            </Box>
          </Box>

        </Stack>
      </Container>
    </GradientBackground>
  );
};

export default Home;