import React, { useState } from 'react';
import { Container, Typography, Box, Stack, styled, IconButton, Button, Card, CardContent, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import { useNavigate } from 'react-router-dom';

const ACCENT_COLOR = '#000000'; 
const REJECT_COLOR = '#ff4d4d';
const LIKE_COLOR = '#4caf50';

const GradientBackground = styled(Box)({
  background: `linear-gradient(135deg, #ebc8ff 0%, #f0f0f0 70%)`,
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

// 各カテゴリーから代表的なものを2〜3個ずつ選定し、合計20問に再構成
const questions = [
  // テクノロジー・デジタル系
  { id: 1, text: "最新のガジェットやPCスペックを調べるのが好きだ" },
  { id: 2, text: "AIツール（ChatGPT等）を使って何かを作ることに興味がある" },
  { id: 3, text: "プログラミングや、仕組みを自作することに興味がある" },
  { id: 4, text: "キーボードやマウスなど、デバイスの打鍵感にこだわりたい" },
  
  // クリエイティブ・表現系
  { id: 5, text: "自分の手で物理的な「モノ」を作り上げるのが好きだ" },
  { id: 6, text: "動画編集や写真撮影で、自分の世界観を表現したい" },
  { id: 7, text: "DIYや修理など、壊れたものを直すことに喜びを感じる" },
  { id: 8, text: "料理の工程を工夫して、最高の一皿を作るのが楽しい" },
  
  // アウトドア・探索・身体系
  { id: 9, text: "休日は家にいるより、外の空気を吸いに行きたい" },
  { id: 10, text: "知らない土地や、裏道を歩き回るのがワクワクする" },
  { id: 11, text: "運動不足を解消するために、楽しく体を動かしたい" },
  { id: 12, text: "キャンプや登山など、自然に囲まれた不便さを楽しみたい" },
  
  // 知的好奇心・ビジネス系
  { id: 13, text: "専門外の分野でも、新しい知識を得るのが純粋に楽しい" },
  { id: 14, text: "投資や資産運用など、お金を増やす仕組みを学びたい" },
  { id: 15, text: "読書を始めると、つい時間を忘れて没頭してしまう" },
  { id: 16, text: "英語などの外国語を使いこなせる自分に憧れる" },
  
  // 環境・性格フィルタ
  { id: 17, text: "趣味のためなら、初期費用（5万円〜）も惜しまない" },
  { id: 18, text: "隙間時間よりも、週末にまとめて数時間没頭したい" },
  { id: 19, text: "大勢でワイワイするより、一人で黙々と作業するのが好きだ" },
  { id: 20, text: "部屋のインテリアや、作業環境の見た目を重視したい" },
];

const SwipePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [yesIndices, setYesIndices] = useState<number[]>([]);

  const handleAnswer = (isYes: boolean) => {
    // 質問が減ったため、activeStepの管理はそのまま有効です
    if (isYes) setYesIndices((prev) => [...prev, activeStep]);
    
    if (activeStep < questions.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, textAlign: 'center', color: ACCENT_COLOR }}>
          しゅみシンクロ診断
        </Typography>

        <Box sx={{ width: '100%', maxWidth: '350px', height: '520px', mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isFinished ? (
            <Fade in={true}>
              <Card sx={{ width: '100%', height: 500, borderRadius: 8, bgcolor: 'white', textAlign: 'center', boxShadow: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 800, color: '#000' }}>診断完了！</Typography>
                <Box sx={{ fontSize: '5rem', mb: 4 }}>🎯</Box>
                <Button 
                  variant="contained" 
                  fullWidth 
                  // navigate時に、厳選されたyesIndicesがmainページに渡ります
                  onClick={() => navigate('/main', { state: { yesIndices } })}
                  sx={{ bgcolor: ACCENT_COLOR, py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  結果を見る
                </Button>
              </Card>
            </Fade>
          ) : (
            <Fade in={true} key={activeStep}>
              <Card sx={{ width: '100%', height: 500, borderRadius: 4, boxShadow: 8, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                <Box sx={{ height: '200px', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {/* 進捗がわかるように 20問中何問目かを表示 */}
                  <Typography variant="h4" sx={{ opacity: 0.5, fontWeight: 900 }}>
                    Q.{questions[activeStep].id} / {questions.length}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.6, color: '#000' }}>
                    {questions[activeStep].text}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          )}
        </Box>

        {!isFinished && (
          <Stack direction="row" spacing={6} justifyContent="center" sx={{ mt: 4 }}>
            <IconButton 
              onClick={() => handleAnswer(false)} 
              sx={{ bgcolor: '#fff', p: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#fdeaea' } }}
            >
              <CloseIcon sx={{ fontSize: 35, color: REJECT_COLOR }} />
            </IconButton>
            <IconButton 
              onClick={() => handleAnswer(true)} 
              sx={{ bgcolor: '#fff', p: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#eafdf0' } }}
            >
              <FavoriteIcon sx={{ fontSize: 35, color: LIKE_COLOR }} />
            </IconButton>
          </Stack>
        )}
      </Container>
    </GradientBackground>
  );
};

export default SwipePage;