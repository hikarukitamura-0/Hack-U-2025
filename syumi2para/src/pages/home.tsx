import React from 'react';
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




{{{/* ================================================================ */}}}
{{{/* ================================================================ */}}}
{{{/* ==       ★糞コード注意★　直すのめんどくさい（動くから良い）      == */}}}
{{{/* ================================================================ */}}}
{{{/* ================================================================ */}}}





// 暖色系のカスタムテーマカラーを定義 (MUIのテーマ設定をオーバーライドする想定)
// ここではカスタムカラーを直接定義します
const ACCENT_COLOR = '#000000ff'; 
const HOVER_COLOR = '#d21dffff';
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


// 抽象的な背景グラデーションを適用するBox
const GradientBackground = styled(Box)(({ theme }) => ({
  // #FADA7A (明るいアプリコット) を基点とし、白へフェードアウトする暖色系グラデーション
  background: `linear-gradient(135deg, #ebc8ffff 0%, ${theme.palette.background.default} 70%)`,
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
              sx={{ my: 8, mb: -0}}
            >
            <img className='logo' src={logo} alt='しゅみしゅみぱらだいす' 
              style={{ width: '350px'}} />
            <img className='lets' src={lets} alt='Let`s Shumi!Shumi!' 
              style={{ width: '370px'}} />
            </Typography>
          </Box>

          {/* 2. ファーストビュー：強いキャッチコピーとメインCTA */}
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography
              variant="h3"
              component="p"
              // 大見出しは極めて太く、余白を大胆に使用
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.9rem', sm: '3rem' },
                lineHeight: 1.2,
                mb: 3,
                color: '#000000ff'
              }}
            >
              {'「ただ日々を貪る高専生」'}
              <br/>
              {'↓'}
              <br/>
              {'「高専生のあるべき姿へ」'}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ fontWeight: 400, mb: 6, fontSize: { xs: '1rem', sm: '1.2rem' },  }}
            >
              マチアプ感覚の直感スワイプで、<br/>ベストな「しゅみ」を見つけよう。<br/>
              Let's Shumi!Shumi!
            </Typography>
            

            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={() => console.log('スワイプ開始')} 
              sx={{ 
                py: 2, 
                px: 6,
                my: 2,
                fontWeight: 700, 
                borderRadius: 4, 
                backgroundColor: ACCENT_COLOR,
                '&:hover': {
                  backgroundColor: HOVER_COLOR,
                }
              }}
            >
              しゅみシンクロ診断を始める
            </Button>
          </Box>

          <Box sx={{ display:'flex', justifyContent: 'center' }}>
            <Divider 
              sx={{
                height: '0.5px',
                width: '90%',
                bgcolor: '#464646ff',
              }} 
            />
          </Box>

          <Box sx={{ textAlign: 'center', my: 4 ,mx:3}}>

            <Typography
              variant="h3"
              component="p"
            sx={{
                fontWeight: 800,
                fontSize: { xs: '1.7rem', sm: '2rem' },
                lineHeight: 1.2,
                mb: 3,
                color: '#000000ff'
              }}
            >
              {'「脳死で無気力」な日々が、'}
              <br/>
              {'君の人生のハイライト。'}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ 
                fontWeight: 400, 
                fontSize: { xs: '1rem', sm: '1.2rem' }, 
                mt: 5, mb: 6,
                padding:3,
                textAlign: 'left' 
              }}
            >
              一日中ベットから動かなかった君の「忍耐力」は、
              長時間作業を要するクリエイティブな趣味でこそ活きる。
              <br/>
              FPSで培った異常なほどの「論理的思考」は、それ以外の場所で輝くべきだ。
              <br/>
              このままじゃ、老後に流れる走馬灯が本当にクソみたいになるぞ。
            </Typography>

          <Box sx={{ display:'flex', justifyContent: 'center' }}>
            <Divider 
              sx={{
                height: '1.1px',
                width: '90%',
                mb: 9,
                bgcolor: '#464646ff',
              }} 
            />
          </Box>

    {/* ==================================== */}
    {/* 2. 機能紹介セクション (箇条書きのデザイン化) */}
    {/* ==================================== */}
    <Box sx={{ px: 3, mb: 8, textAlign: 'left' }}> {/* 全体を左寄せにすることでモダンな印象に */}
      <Typography variant="h3" component="p" sx={{ 
        ...HeadlineStyle, 
        textAlign: 'left', 
        color: MONO_COLOR 
      }}>
        {'惰性のスワイプで、'}
        <br/>
        {'未来をHack you。'}
      </Typography>

      {/* 機能① */}
      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: ACCENT_COLOR, // 機能番号をアクセントカラーで強調
          mb: 1
        }}>
          機能① 【スワイプ】
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          sx={{ ...DescriptionStyle, lineHeight: 1.8 }}
        >
          「あり」か「なし」かの二択で、<br/>
          直感的に趣味を選別。
        </Typography>
      </Box>

      {/* 機能② */}
      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: ACCENT_COLOR, 
          mb: 1
        }}>
          機能② 【シンクロ率】
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          sx={{ ...DescriptionStyle, lineHeight: 1.8 }}
        >
          君の趣味適性を数値化し、<br/>
          最適な趣味を提案。
        </Typography>
      </Box>
    </Box>
            <Typography
              variant="h3"
              component="p"
            sx={{
                fontWeight: 800,
                fontSize: { xs: '1.3rem', sm: '3rem' },
                lineHeight: 1.2,
                mb: 3,
                color: '#000000ff'
              }}
            >
              {'そのままでいいのか？舞鶴高専生よ。'}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ fontWeight: 400, mb: 6 ,fontSize: { xs: '1rem', sm: '1.2rem' }}}
            >
              さあ潮時だ。
              <br/>脳死sh○rt動画、<br/>発狂ヴァ○ラントから抜け出して、
              <br/>新しい自分を見つけに行こう。
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={() => console.log('スワイプ開始')} 
              sx={{ 
                py: 2, 
                px: 6,
                my: 2,
                fontWeight: 700, 
                borderRadius: 4, 
                backgroundColor: ACCENT_COLOR,
                '&:hover': {
                  backgroundColor: HOVER_COLOR,
                }
              }}
            >
              言い訳を捨てて、<br/>しゅみシンクロ診断を始める
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
                      borderColor: ACCENT_COLOR,
                      color: ACCENT_COLOR,
                      '&:hover': {
                        backgroundColor: `${ACCENT_COLOR}15`,
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