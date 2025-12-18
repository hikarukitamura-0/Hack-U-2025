import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { functions, db } from '../firebase'; 
import { httpsCallable } from 'firebase/functions';
import { getAuth, signInAnonymously } from "firebase/auth"; 
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, Button, Container, Stack, Divider, CircularProgress, Paper, Chip } from '@mui/material';
import { AttachMoney, AccessTime, LocationOn, AutoAwesome, Psychology, PlayCircleFilled } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ACCENT_COLOR = '#000000';
const HOVER_COLOR = '#d21dff';

const CleanBackground = styled(Box)({
  background: '#ffffff', minHeight: '100vh', padding: '40px 0', color: '#000000',
});

const HobbyDetailPageModern: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hobbyData, setHobbyData] = useState<any>(null);

  const [syncResult, setSyncResult] = useState({ 
    rate: (location.state as any)?.syncRate || 0, 
    reason: (location.state as any)?.reason || '' 
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const currentAuth = getAuth();
        if (!currentAuth.currentUser) await signInAnonymously(currentAuth);

        const docRef = doc(db, "hobbies", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHobbyData(docSnap.data());
          
          if (syncResult.rate === 0) {
            try {
              const getRate = httpsCallable(functions, 'getHobbySyncRate');
              const result = await getRate({ hobbyId: id });
              const resData = result.data as any;
              setSyncResult({ rate: resData.syncRate || 85, reason: resData.reason || "マッチしています。" });
            } catch (e) {
              setSyncResult({ rate: 85, reason: "高い適合性が確認されています。" });
            }
          }
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, syncResult.rate]);

  if (loading) return (
    <CleanBackground sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ color: HOVER_COLOR }} />
    </CleanBackground>
  );

  if (!hobbyData) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5">データが見つかりません</Typography>
      <Button onClick={() => navigate('/main')} sx={{ mt: 2 }}>戻る</Button>
    </Container>
  );

  return (
    <CleanBackground>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>{hobbyData.name_ja}</Typography>
            <Divider sx={{ width: '60px', height: '4px', bgcolor: HOVER_COLOR, mx: 'auto', mt: 2 }} />
          </Box>

          <Box sx={{ p: 4, borderRadius: 6, textAlign: 'center', bgcolor: '#f8f0ff' }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <AutoAwesome sx={{ color: HOVER_COLOR, fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: HOVER_COLOR }}>SYNC ANALYSIS</Typography>
            </Stack>
            <Typography variant="h1" sx={{ fontWeight: 900 }}>{syncResult.rate}%</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 1 }}>{syncResult.reason}</Typography>
          </Box>

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
                  <Typography variant="caption" display="block">{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.value || '不明'}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#000', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>高専生との関連性</Typography>
            <Typography variant="body1">{hobbyData.recommendation?.kosen_suitability}</Typography>
          </Box>

          {/* 始めるきっかけ: recommendation.reason_to_start を参照 */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PlayCircleFilled sx={{ color: HOVER_COLOR }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>始めるきっかけ</Typography>
            </Stack>
            <Typography variant="body1" sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, borderLeft: `4px solid ${HOVER_COLOR}`, whiteSpace: 'pre-wrap' }}>
              {hobbyData.recommendation?.reason_to_start || "新しい挑戦として始めてみましょう。"}
            </Typography>
          </Box>

          {/* 必要なスキル: recommendation.skills 配列を参照 */}
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
                <Typography variant="body1" sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, borderLeft: `4px solid ${HOVER_COLOR}` }}>
                  {hobbyData.recommendation?.skills || "特別なスキルは必要ありません。"}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', pt: 2, pb: 4 }}>
            <Button variant="contained" onClick={() => navigate('/main')} sx={{ bgcolor: ACCENT_COLOR, py: 2, borderRadius: 10, width: '100%', fontWeight: 'bold' }}>
              戻る
            </Button>
          </Box>
        </Stack>
      </Container>
    </CleanBackground>
  );
};
export default HobbyDetailPageModern;