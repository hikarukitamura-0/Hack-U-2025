import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, List, ListItemButton, ListItemText, Divider, Button } from '@mui/material';
import { ArrowBackIos, Celebration } from '@mui/icons-material';

const LikedListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 前のページから送られてきたデータを受け取る
  const { likedHobbies } = (location.state as { likedHobbies: any[] }) || { likedHobbies: [] };

  return (
    <Box sx={{ minHeight: '100vh', py: 5, backgroundColor: '#f3e5f5' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Celebration sx={{ fontSize: 60, color: '#d21dff', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 900 }}>最終候補リスト</Typography>
          <Typography variant="body2" color="text.secondary">
            あなたが「いいね」した趣味のまとめです
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: '20px', overflow: 'hidden' }} elevation={4}>
          {likedHobbies.length > 0 ? (
            <List disablePadding>
              {likedHobbies.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItemButton onClick={() => navigate(`/syousai/${item.id}`)} sx={{ py: 2 }}>
                    <ListItemText 
                      primary={`${index + 1}. ${item.name}`} 
                      secondary={item.Category}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                    <Typography variant="caption" sx={{ color: '#d21dff' }}>詳細 ＞</Typography>
                  </ListItemButton>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>候補がありませんでした</Typography>
            </Box>
          )}
        </Paper>

        <Button 
          fullWidth 
          startIcon={<ArrowBackIos />} 
          onClick={() => navigate('/finalmatch')} 
          sx={{ mt: 4, color: '#000', fontWeight: 'bold' }}
        >
          もう一度選び直す
        </Button>
      </Container>
    </Box>
  );
};

export default LikedListPage;