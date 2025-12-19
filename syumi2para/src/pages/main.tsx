import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Stack, styled, Button, CircularProgress, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AutoAwesome, RocketLaunch, ChevronRight, WorkspacePremium } from '@mui/icons-material';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import initialHobbiesData from '../data/hobbies.json'; 

const ACCENT_COLOR = '#000000'; 
const SYNC_PURPLE = '#d21dff';

const GradientBackground = styled(Box)({
  background: `linear-gradient(135deg, #ebc8ff 0%, #f0f0f0 70%)`,
  minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
});

const ResultCard = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  padding: '40px 24px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  position: 'relative',
  zIndex: 1,
  '&:hover': { transform: 'translateY(-4px)' },
});

const getRankInfo = (rate: number) => {
  if (rate >= 95) return { name: "運命のシンクロ", color: "#ff1493", comment: "これ以上ない最高の相性です！" };
  if (rate >= 90) return { name: "伝説級の相性", color: "#ff8c00", comment: "あなたのための趣味と言っても過言ではありません。" };
  if (rate >= 80) return { name: "理想的なパートナー", color: "#32cd32", comment: "驚くほどスムーズに始められるでしょう。" };
  if (rate >= 70) return { name: "安定のベストマッチ", color: "#1e90ff", comment: "確実な楽しみが約束されています。" };
  return { name: "期待のニューフェイス", color: "#808080", comment: "新しい世界を覗くチャンスです。" };
};

const Main: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width, height } = useWindowSize();
  const [matchingHobby, setMatchingHobby] = useState<any>(null);
  const [syncRate, setSyncRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const savedResult = sessionStorage.getItem('last_diagnostic_result');
    const isNewDiagnosis = location.state && (location.state as any).yesIndices;

    if (savedResult && !isNewDiagnosis) {
      const parsed = JSON.parse(savedResult);
      setMatchingHobby(parsed.hobby);
      setSyncRate(parsed.rate);
      setLoading(false);
      if (parsed.rate >= 95) setShowConfetti(true);
      return;
    }

    const calculateLogic = () => {
      try {
        const yesIndices: number[] = (location.state as any)?.yesIndices || [];
        const hobbyEntries = Object.entries(initialHobbiesData);
        
        // --- 厳選20問に基づいたカテゴリ定義 ---
        const catIdx = {
          digital: [0, 1, 2, 3],     // テクノロジー
          creative: [4, 5, 6, 7],    // クリエイティブ
          outdoor: [8, 9, 10, 11],   // アウトドア
          knowledge: [12, 13, 14, 15] // 知的好奇心
          // 16-19 は環境フィルタとして使用
        };

        const results = hobbyEntries.map(([id, data]: [string, any]) => {
          let score = 0;
          const cat = data.category_id;

          // 1. カテゴリ適性 (最大 50点)
          let targetIndices: number[] = [];
          if (cat === 'digital_tech') targetIndices = catIdx.digital;
          if (cat === 'creative') targetIndices = catIdx.creative;
          if (cat === 'exploration') targetIndices = catIdx.outdoor;
          if (cat === 'knowledge') targetIndices = catIdx.knowledge;
          if (cat === 'wellbeing') targetIndices = [10, 11, 18]; // 運動・自然・健康

          const matchCount = yesIndices.filter(i => targetIndices.includes(i)).length;
          score += (matchCount / (targetIndices.length || 1)) * 50;

          // 2. 環境適合度 (最大 30点)
          // コスト: Q17 (index 16)
          if (data.cost_conditions?.initial_cost?.includes('高')) {
            score += yesIndices.includes(16) ? 15 : -10;
          } else {
            score += 10;
          }
          // 場所: Q9 (index 8), Q10 (index 9)
          if (data.cost_conditions?.location?.includes('屋外')) {
            score += (yesIndices.includes(8) || yesIndices.includes(9)) ? 15 : -20;
          }

          // 3. 性格適合 (最大 20点)
          // ソロプレイ: Q19 (index 18)
          if (data.social_features?.solo_play) {
            score += yesIndices.includes(18) ? 20 : 5;
          }

          return { id, data, totalScore: score };
        });

        const winner = results.reduce((prev, curr) => (prev.totalScore > curr.totalScore) ? prev : curr);
        
        // 20問用に正規化 (基礎点 + 回答割合による補正)
        const finalRate = Math.floor(Math.max(60, Math.min(98, winner.totalScore + 20)));

        setMatchingHobby({ id: winner.id, ...winner.data });
        setSyncRate(finalRate);
        
        if (finalRate >= 95) setShowConfetti(true);

        sessionStorage.setItem('last_diagnostic_result', JSON.stringify({ 
          hobby: { id: winner.id, ...winner.data }, 
          rate: finalRate 
        }));

      } catch (error) {
        console.error("Calculation Error:", error);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    calculateLogic();
  }, [location.state]);

  const handleGoToDetail = () => {
    if (matchingHobby?.id) {
      navigate(`/syousai/${matchingHobby.id}`, { 
        state: { syncRate: syncRate, reason: "20の質問から導き出されたあなたの最適解です。" } 
      });
    }
  };

  const rank = getRankInfo(syncRate);

  if (loading) return (
    <GradientBackground sx={{ justifyContent: 'center' }}>
      <CircularProgress sx={{ color: SYNC_PURPLE }} />
      <Typography sx={{ mt: 3, fontWeight: 800, color: '#000' }}>分析中...</Typography>
    </GradientBackground>
  );

  return (
    <GradientBackground>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} colors={['#ff1493', '#ff69b4', '#d21dff', '#ffffff']} />}

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Stack spacing={4} alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#000' }}>診断結果</Typography>
          
          <ResultCard onClick={handleGoToDetail}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 2, py: 0.5, borderRadius: '20px', bgcolor: `${rank.color}15`, border: `2px solid ${rank.color}`, mb: 2 }}>
              <WorkspacePremium sx={{ color: rank.color, fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 900, color: rank.color, letterSpacing: 1 }}>{rank.name}</Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#000' }}>{matchingHobby?.name_ja}</Typography>
            <Divider sx={{ my: 1, width: '40px', height: '4px', bgcolor: SYNC_PURPLE, mx: 'auto' }} />
            
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '5.5rem', color: '#000', lineHeight: 1 }}>
              {syncRate}<span style={{ fontSize: '2rem' }}>%</span>
            </Typography>
            <Typography variant="body2" sx={{ color: rank.color, fontWeight: 800, mb: 3 }}>{rank.comment}</Typography>
            
            <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f3f5', textAlign: 'left', mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <RocketLaunch sx={{ color: SYNC_PURPLE, fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#000' }}>高専生へのメッセージ</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 500, lineHeight: 1.6 }}>{matchingHobby?.recommendation?.kosen_suitability}</Typography>
            </Box>
            
            <Typography variant="button" sx={{ color: SYNC_PURPLE, fontWeight: 800 }}>詳細をチェックする ➔</Typography>
          </ResultCard>

          <Button variant="outlined" fullWidth onClick={() => navigate('/')} sx={{ color: '#000', borderColor: '#000', py: 1.5, borderRadius: 3, fontWeight: 'bold' }}>ホームに戻る</Button>
        </Stack>
      </Container>
    </GradientBackground>
  );
};

export default Main;