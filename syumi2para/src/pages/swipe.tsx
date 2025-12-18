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

const questions = [
  { id: 1, text: "PCやスマホの内部設定をいじるのが好きだ" },
  { id: 2, text: "最新のガジェットと聞くと、ついスペックを調べてしまう" },
  { id: 3, text: "AI（ChatGPT等）を使って作業を効率化することに興味がある" },
  { id: 4, text: "プログラミングや、仕組みを自作することに興味がある" },
  { id: 5, text: "仮想通貨やブロックチェーンなど、新しい経済技術が気になる" },
  { id: 6, text: "キーボードやマウスなど、毎日触れるデバイスにこだわりたい" },
  { id: 7, text: "サイバーセキュリティやハッキングの仕組みに興味がある" },
  { id: 8, text: "3DモデルやVR空間など、仮想世界に魅力を感じる" },
  { id: 9, text: "自分の手で物理的な「モノ」を作り上げるのが好きだ" },
  { id: 10, text: "絵を描いたり、デザインを考えたりするのが好きだ" },
  { id: 11, text: "動画編集や写真撮影で、自分の世界観を表現したい" },
  { id: 12, text: "音楽の機材や、音の質にこだわりがある" },
  { id: 13, text: "料理の工程を工夫して、最高の一皿を作るのが楽しい" },
  { id: 14, text: "自分の考えを文章にして、SNSやブログで発信したい" },
  { id: 15, text: "DIYや修理など、壊れたものを直すことに喜びを感じる" },
  { id: 16, text: "3Dプリンタなどの工作機械を使ってみたい" },
  { id: 17, text: "休日は家にいるより、外の空気を吸いに行きたい" },
  { id: 18, text: "知らない土地や、裏道を歩き回るのがワクワクする" },
  { id: 19, text: "運動不足を解消するために、体を動かす習慣が欲しい" },
  { id: 20, text: "キャンプや登山など、不便な環境を楽しむ余裕がある" },
  { id: 21, text: "自転車やバイクなど、乗り物で移動すること自体が好きだ" },
  { id: 22, text: "サウナや温泉などで、心身をリセットするのが好きだ" },
  { id: 23, text: "植物を育てたり、自然に触れたりするのが落ち着く" },
  { id: 24, text: "魚釣りや天体観測など、じっと「待つ」時間も楽しめる" },
  { id: 25, text: "専門外の分野でも、新しい知識を得るのが純粋に楽しい" },
  { id: 26, text: "読書を始めると、つい時間を忘れて没頭してしまう" },
  { id: 27, text: "英語などの外国語を話せる自分に憧れる" },
  { id: 28, text: "投資や資産運用など、お金を増やす仕組みを学びたい" },
  { id: 29, text: "歴史や哲学など、物事の根本的な理由を考えるのが好きだ" },
  { id: 30, text: "誰かに教えたり、誰かの役に立ったりすることに価値を感じる" },
  { id: 31, text: "起業や副業など、自分の力で稼ぐスキルを身につけたい" },
  { id: 32, text: "心理学やデータ分析など、人の行動を読み解くのが面白い" },
  { id: 33, text: "趣味のためなら、初期費用（5万円〜）も惜しまない" },
  { id: 34, text: "隙間時間よりも、週末にまとめて数時間没頭したい" },
  { id: 35, text: "大勢で協力するより、一人で黙々と作業する方が好きだ" },
  { id: 36, text: "部屋のインテリアや、作業環境の見た目を重視する" },
  { id: 37, text: "結果よりも、その過程（プロセス）を楽しむタイプだ" },
  { id: 38, text: "スマホゲームよりも、現実に残る成果物が欲しい" },
  { id: 39, text: "流行のものより、長く愛されている定番のものが好きだ" },
  { id: 40, text: "睡眠や食事など、自分の体調管理をデータ化してみたい" },
];

const SwipePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [yesIndices, setYesIndices] = useState<number[]>([]);

  const handleAnswer = (isYes: boolean) => {
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
                  <Typography variant="h2" sx={{ opacity: 0.2, fontWeight: 900 }}>Q.{questions[activeStep].id}</Typography>
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