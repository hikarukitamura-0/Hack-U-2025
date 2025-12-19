import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from '../firebase'; 
import { doc, getDoc } from "firebase/firestore";
import { 
  Box, Typography, Button, Container, Stack, Divider, 
  CircularProgress, Paper, Chip 
} from '@mui/material';
import { 
  AttachMoney, AccessTime, LocationOn, AutoAwesome, 
  Psychology, PlayCircleFilled, ListAlt 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

export const ACCENT_COLOR = '#000000';
const HOVER_COLOR = '#d21dff';

const CleanBackground = styled(Box)({
  background: '#ffffff',
  minHeight: '100vh',
  padding: '40px 0',
  color: '#000000',
});

  const Top = () => {
    window.scrollTo({
      top: 0,
    });
  };

const HobbyDetailPageModern: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hobbyData, setHobbyData] = useState<any>(null);

  // 1. 遷移元（Main/Itiran/FinalMatch）から渡された数値と理由を優先取得
  const [displayRate, setDisplayRate] = useState<number>((location.state as any)?.syncRate || 0);
  const [syncReason, setSyncReason] = useState<string>(
    (location.state as any)?.reason || "20の質問から導き出されたあなたの最適解です。"
  );

  // 2. ユーザーの回答(yesIndices)を復元（直接アクセス時の再計算用）
  const yesIndices: number[] = useMemo(() => {
    const stateIndices = (location.state as any)?.yesIndices;
    if (stateIndices) return stateIndices;
    const saved = localStorage.getItem('user_yes_indices');
    return saved ? JSON.parse(saved) : [];
  }, [location.state]);

  // 3. マッチング計算ロジック（バックアップ用）
  const calculateRate = useCallback((hData: any, answers: number[]) => {
    if (!answers || answers.length === 0) return 60;
    const catIdx = {
      digital: [0, 1, 2, 3], creative: [4, 5, 6, 7],
      outdoor: [8, 9, 10, 11], knowledge: [12, 13, 14, 15]
    };
    let score = 0;
    const cat = hData.category_id;
    let targetIndices: number[] = [];
    if (cat === 'digital_tech') targetIndices = catIdx.digital;
    if (cat === 'creative') targetIndices = catIdx.creative;
    if (cat === 'exploration') targetIndices = catIdx.outdoor;
    if (cat === 'knowledge') targetIndices = catIdx.knowledge;
    if (cat === 'wellbeing') targetIndices = [10, 11, 18];

    const matchCount = answers.filter(i => targetIndices.includes(i)).length;
    score += (matchCount / (targetIndices.length || 1)) * 50;
    if (hData.cost_conditions?.initial_cost?.includes('高')) score += answers.includes(16) ? 15 : -10; else score += 10;
    if (hData.cost_conditions?.location?.includes('屋外')) score += (answers.includes(8) || answers.includes(9)) ? 15 : -20;
    if (hData.social_features?.solo_play) score += answers.includes(18) ? 20 : 5;
    return Math.floor(Math.max(60, Math.min(98, score + 20)));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, "hobbies", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHobbyData(data);
          
          // FinalMatch等からの上書きデータがあるか確認
          const stateData = location.state as any;
          if (stateData?.syncRate) {
            setDisplayRate(stateData.syncRate);
            if (stateData.reason) setSyncReason(stateData.reason);
          } else if (displayRate === 0) {
            // データが渡されていない場合のみ、このページで計算
            setDisplayRate(calculateRate(data, yesIndices));
          }
        }
      } catch (error) {
        console.error("Firebase Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0); 
  }, [id, yesIndices, calculateRate, displayRate, location.state]);

  if (loading) return (
    <CleanBackground sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ color: HOVER_COLOR }} />
    </CleanBackground>
  );

  if (!hobbyData) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5">データが見つかりません</Typography>
      <Button onClick={() => navigate('/itiran')} sx={{ mt: 2 }}>一覧へ戻る</Button>
    </Container>
  );

  return (
    <CleanBackground>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          {/* タイトル */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 900, wordBreak: 'break-word' }}>
              {hobbyData.name_ja}
            </Typography>
            <Divider sx={{ width: '60px', height: '4px', bgcolor: HOVER_COLOR, mx: 'auto', mt: 2, borderRadius: 2 }} />
          </Box>

          {/* シンクロ率カード */}
          <Box sx={{ p: 4, borderRadius: 6, textAlign: 'center', bgcolor: '#fbf5ff', border: `1px solid ${HOVER_COLOR}20` }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <AutoAwesome sx={{ color: HOVER_COLOR, fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: HOVER_COLOR }}>SYNC ANALYSIS</Typography>
            </Stack>
            <Typography variant="h1" sx={{ fontWeight: 900, lineHeight: 1 }}>{displayRate}%</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontWeight: 700 }}>
               {syncReason}
            </Typography>
          </Box>

          {/* 活動条件 */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>活動条件</Typography>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              {[
                { label: '初期費用', value: hobbyData.cost_conditions?.initial_cost, icon: <AttachMoney /> },
                { label: '所要時間', value: hobbyData.cost_conditions?.time_required, icon: <AccessTime /> },
                { label: '場所', value: hobbyData.cost_conditions?.location, icon: <LocationOn /> }
              ].map((item, i) => (
                <Paper key={i} sx={{ p: 2, flex: 1, textAlign: 'center', borderRadius: 4, bgcolor: '#f8f9fa' }} elevation={0}>
                  <Box sx={{ color: HOVER_COLOR }}>{item.icon}</Box>
                  <Typography variant="caption" display="block" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.value || '不明'}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* 高専生との関連性 */}
          <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#000', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>高専生との関連性</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {hobbyData.recommendation?.kosen_suitability}
            </Typography>
          </Box>

          {/* 始めるきっかけ */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PlayCircleFilled sx={{ color: HOVER_COLOR }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>始めるきっかけ</Typography>
            </Stack>
            <Typography variant="body1" sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, borderLeft: `4px solid ${HOVER_COLOR}`, whiteSpace: 'pre-wrap' }}>
              {hobbyData.recommendation?.reason_to_start || "新しい挑戦として始めてみましょう。"}
            </Typography>
          </Box>

          {/* 必要なスキル */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Psychology sx={{ color: HOVER_COLOR }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>必要なスキル</Typography>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.isArray(hobbyData.recommendation?.skills) ? (
                hobbyData.recommendation.skills.map((skill: string, i: number) => (
                  <Chip key={i} label={skill} sx={{ fontWeight: 600, bgcolor: '#f1f3f5' }} />
                ))
              ) : (
                <Typography variant="body2" sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3 }}>
                  {hobbyData.recommendation?.skills || "特別なスキルは必要ありません。"}
                </Typography>
              )}
            </Box>
          </Box>

          {/* 一覧ページへの誘導バナー */}
          <Box sx={{ mt: 2, p: 3, borderRadius: 4, textAlign: 'center', border: `2px dashed ${HOVER_COLOR}40`, bgcolor: '#fafafa' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
              他にもあなたに合う候補が19個あります
            </Typography>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<ListAlt />}
            onClick={() => {
              Top(); // 1. Top関数を実行
              navigate('/finalmatch', { state: { yesIndices } }); // 2. ページ遷移を実行
            }}
              sx={{ color: HOVER_COLOR, borderColor: HOVER_COLOR, py: 1.5, fontWeight: 'bold', borderRadius: 3, '&:hover': { borderColor: HOVER_COLOR, bgcolor: '#f3e5f5' } }}
            >
              スワイプで他のおすすめの趣味見る
            </Button>
          </Box>

          {/* 戻るボタン */}
          <Box sx={{ pt: 2, pb: 6 }}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => navigate('/main')} 
              sx={{ bgcolor: ACCENT_COLOR, py: 2, borderRadius: 10, fontWeight: 'bold', '&:hover': { bgcolor: '#333' } }}
            >
              診断結果画面に戻る
            </Button>
          </Box>
        </Stack>
      </Container>
    </CleanBackground>
  );
};
export default HobbyDetailPageModern;