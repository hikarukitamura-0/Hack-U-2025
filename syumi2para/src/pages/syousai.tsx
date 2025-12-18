import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from "react-router-dom";
import { functions, db } from '../firebase'; 
import { httpsCallable } from 'firebase/functions';
import { getAuth, signInAnonymously } from "firebase/auth"; 
import { doc, getDoc } from "firebase/firestore";
import {
  Box, Typography, Button, Container, Stack, Divider,
  ListItemIcon, CircularProgress, Grid, Chip
} from '@mui/material';
import {
  Palette, Code, RocketLaunch, Lightbulb, AutoAwesome, Construction,
  AttachMoney, AccessTime, LocationOn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ACCENT_COLOR = '#000000';
const HOVER_COLOR = '#d21dff';

const CleanBackground = styled(Box)({
  background: '#ffffff', minHeight: '100vh', padding: '40px 0', color: '#000000',
});

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'digital_tech': return <Code sx={{ fontSize: 40 }} />;
    case 'creative': return <Palette sx={{ fontSize: 40 }} />;
    case 'knowledge': return <Lightbulb sx={{ fontSize: 40 }} />;
    default: return <Construction sx={{ fontSize: 40 }} />;
  }
};

const HobbyDetailPageModern: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [loading, setLoading] = useState(true);
  const [hobbyData, setHobbyData] = useState<any>(null);
  const [syncResult, setSyncResult] = useState({ rate: 0, reason: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const currentAuth = getAuth();
        await signInAnonymously(currentAuth);

        const docRef = doc(db, "hobbies", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHobbyData(docSnap.data());
          const getRate = httpsCallable(functions, 'getHobbySyncRate');
          const result = await getRate({ hobbyId: id });
          const resData = result.data as { syncRate: number, reason: string };
          setSyncResult({ rate: resData.syncRate, reason: resData.reason });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '80vh' }}>
      <CircularProgress sx={{ color: HOVER_COLOR }} />
      <Typography sx={{ mt: 2, fontWeight: 'bold' }}>分析中...</Typography>
    </Stack>
  );

  if (!hobbyData) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5">データが見つかりません</Typography>
      <Button component={RouterLink} to="/main" sx={{ mt: 2 }}>戻る</Button>
    </Container>
  );

  return (
    <CleanBackground>
      <Container maxWidth="sm">
        <Stack spacing={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ color: HOVER_COLOR, mb: 2 }}>{getCategoryIcon(hobbyData.category_id)}</Box>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>{hobbyData.name_ja}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{hobbyData.recommendation?.reason_to_start}</Typography>
            <Divider sx={{ width: '40px', height: '4px', bgcolor: ACCENT_COLOR, mx: 'auto', mt: 3, borderRadius: 2 }} />
          </Box>

          <Box sx={{ p: 4, borderRadius: 8, textAlign: 'center', background: `linear-gradient(135deg, ${HOVER_COLOR}15, #ffffff)`, border: `2px solid ${HOVER_COLOR}30` }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <AutoAwesome sx={{ color: HOVER_COLOR, fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: HOVER_COLOR, letterSpacing: 1 }}>HOBBY SYNC RATE</Typography>
            </Stack>
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '5rem' }}>{syncResult.rate}%</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 2 }}>{syncResult.reason}</Typography>
          </Box>

          <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#f8f9fa' }}>
            <Stack direction="row" spacing={2}>
              <RocketLaunch sx={{ color: HOVER_COLOR }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">高専との相性</Typography>
                <Typography variant="body1" fontWeight={700}>{hobbyData.recommendation?.kosen_suitability}</Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>ファーストステップ</Typography>
            <Stack spacing={3}>
              {hobbyData.recommendation?.steps?.map((step: string, index: number) => (
                <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                  <Chip label={`0${index + 1}`} sx={{ fontWeight: 900, bgcolor: '#fff', border: '1px solid #000' }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, pt: 0.5 }}>{step}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box sx={{ textAlign: 'center', pb: 10 }}>
            <Button variant="contained" component={RouterLink} to="/main" sx={{ bgcolor: ACCENT_COLOR, borderRadius: 10, px: 8, py: 2 }}>
              スワイプに戻る
            </Button>
          </Box>
        </Stack>
      </Container>
    </CleanBackground>
  );
};

export default HobbyDetailPageModern;