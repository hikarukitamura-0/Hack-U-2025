import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Stack, styled, Button, CircularProgress, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AutoAwesome, RocketLaunch, ChevronRight, WorkspacePremium } from '@mui/icons-material';
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
  '&:hover': { transform: 'translateY(-4px)' },
});

// 称号の定義
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
  const [matchingHobby, setMatchingHobby] = useState<any>(null);
  const [syncRate, setSyncRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedResult = sessionStorage.getItem('last_diagnostic_result');
    const isNewDiagnosis = location.state && (location.state as any).yesIndices;

    if (savedResult && !isNewDiagnosis) {
      const parsed = JSON.parse(savedResult);
      setMatchingHobby(parsed.hobby);
      setSyncRate(parsed.rate);
      setLoading(false);
      return;
    }

    const calculateLogic = () => {
      try {
        const yesIndices: number[] = (location.state as any)?.yesIndices || [];
        const hobbyEntries = Object.entries(initialHobbiesData);
        
        let bestHobby = null;
        let maxFinalScore = -1;

        const catIdx = {
          digital: [0, 1, 2, 3, 5, 6, 7],
          creative: [8, 9, 10, 11, 12, 13, 14, 15],
          outdoor: [16, 17, 19, 20, 22, 23],
          knowledge: [24, 25, 26, 27, 28, 30, 31],
          wellbeing: [12, 18, 21, 22, 39]
        };

        const results = hobbyEntries.map(([id, data]: [string, any]) => {
          let score = 0;
          const cat = data.category_id;

          let targetIndices: number[] = [];
          if (cat === 'digital_tech') targetIndices = catIdx.digital;
          if (cat === 'creative') targetIndices = catIdx.creative;
          if (cat === 'exploration') targetIndices = catIdx.outdoor;
          if (cat === 'knowledge') targetIndices = catIdx.knowledge;
          if (cat === 'wellbeing') targetIndices = catIdx.wellbeing;

          const matchCount = yesIndices.filter(i => targetIndices.includes(i)).length;
          score += (matchCount / (targetIndices.length || 1)) * 50;

          if (data.cost_conditions?.initial_cost?.includes('高')) {
            score += yesIndices.includes(32) ? 15 : -10;
          } else { score += 10; }

          if (data.cost_conditions?.location?.includes('屋外')) {
            score += (yesIndices.includes(16) || yesIndices.includes(18)) ? 15 : -20;
          }

          if (data.social_features?.solo_play) {
            score += yesIndices.includes(34) ? 20 : 5;
          }

          return { id, data, totalScore: score };
        });

        const winner = results.reduce((prev, curr) => (prev.totalScore > curr.totalScore) ? prev : curr);
        const finalRate = Math.floor(Math.max(60, Math.min(98, winner.totalScore + 20)));

        setMatchingHobby({ id: winner.id, ...winner.data });
        setSyncRate(finalRate);
        sessionStorage.setItem('last_diagnostic_result', JSON.stringify({ hobby: { id: winner.id, ...winner.data }, rate: finalRate }));
      } catch (error) { console.error(error); } finally { setTimeout(() => setLoading(false), 2000); }
    };
    calculateLogic();
  }, [location.state]);

  const handleGoToDetail = () => {
    if (matchingHobby?.id) {
      navigate(`/syousai/${matchingHobby.id}`, { state: { syncRate: syncRate, reason: "論理計算により算出されたマッチング結果です。" } });
    }
  };

  const rank = getRankInfo(syncRate);

  if (loading) return (
    <GradientBackground sx={{ justifyContent: 'center' }}>
      <CircularProgress sx={{ color: SYNC_PURPLE }} />
      <Typography sx={{ mt: 3, fontWeight: 800, color: '#000' }}>シンクロ率を計算中...</Typography>
    </GradientBackground>
  );

  return (
    <GradientBackground>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Stack spacing={4} alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#000' }}>診断結果</Typography>
          
          <ResultCard onClick={handleGoToDetail}>
            {/* 称号バッジの表示 */}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 2, py: 0.5, borderRadius: '20px', bgcolor: `${rank.color}15`, border: `1px solid ${rank.color}`, mb: 2 }}>
              <WorkspacePremium sx={{ color: rank.color, fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 900, color: rank.color, letterSpacing: 1 }}>{rank.name}</Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#000' }}>{matchingHobby?.name_ja}</Typography>
            <Divider sx={{ my: 1, width: '40px', height: '4px', bgcolor: SYNC_PURPLE, mx: 'auto' }} />
            
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '5.5rem', color: '#000', lineHeight: 1 }}>{syncRate}<span style={{ fontSize: '2rem' }}>%</span></Typography>
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