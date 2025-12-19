// pages/itiran.tsx
import React, { useMemo } from 'react';
import { Container, Typography, Box, Stack, styled, Button, Paper, List, ListItem, ListItemText, ListItemButton, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AutoAwesome, Explore, Psychology } from '@mui/icons-material';
import initialHobbiesData from '../data/hobbies.json';

const ACCENT_COLOR = '#000000';
const HOVER_COLOR = '#d21dff';

const GradientBackground = styled(Box)({
  background: `linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)`,
  minHeight: '100vh', padding: '40px 0',
});

const ItiranPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const yesIndices = useMemo(() => {
    const saved = localStorage.getItem('user_yes_indices');
    return saved ? JSON.parse(saved) : [];
  }, []);

  // 内部的なマッチング計算（上位20個抽出用）
  const recommendations = useMemo(() => {
    const all = Object.entries(initialHobbiesData).map(([id, data]: [string, any]) => {
      let score = 0;
      if (data.category_id === 'digital_tech' && yesIndices.some((i: any) => [0,1,2,3].includes(i))) score += 20;
      // ...（Main.tsxと同じロジック）
      return { id, ...data, score };
    });
    return all.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [yesIndices]);

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>あなたに合う趣味20選</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              診断結果に基づいた、特におすすめのリストです
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<AutoAwesome />}
            onClick={() => navigate('/finalmatch', { state: { items: recommendations } })}
            sx={{ bgcolor: HOVER_COLOR, py: 2, borderRadius: 4, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(210, 29, 255, 0.4)' }}
          >
            この20個から1つをスワイプで選ぶ
          </Button>

          <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <List disablePadding>
              {recommendations.map((item, index) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton onClick={() => navigate(`/syousai/${item.id}`)}>
                    <ListItemText 
                      primary={`${index + 1}. ${item.name_ja}`}
                      secondary={item.category_id}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                    <Explore sx={{ color: HOVER_COLOR, opacity: 0.5 }} />
                  </ListItemButton>
                  <Divider />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Button onClick={() => navigate('/main')} sx={{ color: ACCENT_COLOR, fontWeight: 'bold' }}>
            診断結果画面へ戻る
          </Button>
        </Stack>
      </Container>
    </GradientBackground>
  );
};

export default ItiranPage;