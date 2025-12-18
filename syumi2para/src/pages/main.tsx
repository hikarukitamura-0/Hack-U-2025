import React, { useState, useCallback } from 'react';
import { Container, Typography, Box, Stack, styled, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import TinderCard from 'react-tinder-card';
import { useNavigate } from 'react-router-dom';

import SwipeCard from '../components/SwipeCard';
import initialHobbiesData from '../data/hobbies.json'; 
import type { Hobby } from '../types/types'; 

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

const Main = () => {
  const navigate = useNavigate();

  const getInitialHobbies = () => {
    if (Array.isArray(initialHobbiesData)) {
      return initialHobbiesData as unknown as Hobby[];
    } else if (initialHobbiesData && typeof initialHobbiesData === 'object' && 'hobbies' in initialHobbiesData) {
      // @ts-ignore
      return initialHobbiesData.hobbies as unknown as Hobby[];
    }
    return [];
  };

  const [hobbies] = useState<Hobby[]>(getInitialHobbies());
  const [swiped, setSwiped] = useState<{ liked: (string | number)[], disliked: (string | number)[] }>({
    liked: [],
    disliked: []
  });
  
  const [currentIndex, setCurrentIndex] = useState(hobbies.length - 1);

  // ★ 解決策1：ブラウザを強制リロードして、診断を真っさらな状態から開始する
  const handleRestart = () => {
    window.location.href = '/main'; 
  };

  // ★ 解決策2：トップページ（概要ページ）へ戻る
  const handleGoHome = () => {
    window.location.href = '/'; 
  };

  const onSwipe = useCallback((direction: string, hobbyId: string | number) => {
    if (direction === 'right') {
      setSwiped(prev => ({ ...prev, liked: [...prev.liked, hobbyId] }));
    } else if (direction === 'left') {
      setSwiped(prev => ({ ...prev, disliked: [...prev.disliked, hobbyId] }));
    }
    setCurrentIndex(prev => prev - 1); 
  }, []);

  const handleGoToDetail = (id: string | number) => {
    navigate(`/syousai/${String(id)}`);
  };

  const isComplete = currentIndex < 0;

  return (
    <GradientBackground>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, textAlign: 'center', color: ACCENT_COLOR }}>
          しゅみシンクロ診断
        </Typography>

        <Box sx={{ position: 'relative', width: '100%', maxWidth: '350px', height: '520px', mx: 'auto' }}>
          {isComplete ? (
            <Box sx={{ 
              p: 4, borderRadius: 8, bgcolor: 'white', textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: '480px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 900, color: ACCENT_COLOR }}>
                🎉 診断完了！
              </Typography>
              
              <Box sx={{ fontSize: '4rem', mb: 2 }}>🎊</Box>

              <Typography variant="body1" sx={{ mb: 4, color: ACCENT_COLOR, fontWeight: 500 }}>
                気になる趣味が <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{swiped.liked.length}</span> 件<br />
                見つかりました！
              </Typography>

              <Stack spacing={2} sx={{ width: '100%' }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ bgcolor: ACCENT_COLOR, color: '#fff', py: 2, borderRadius: 3, fontWeight: 'bold' }} 
                  onClick={handleRestart} 
                >
                  もう一度診断する
                </Button>

                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ color: ACCENT_COLOR, borderColor: ACCENT_COLOR, py: 1.5, borderRadius: 3, fontWeight: 'bold' }} 
                  onClick={handleGoHome} 
                >
                  トップページに戻る
                </Button>
              </Stack>
            </Box>
          ) : (
            hobbies.map((hobby, index) => (
              <TinderCard
                key={hobby.id}
                onSwipe={(dir) => onSwipe(dir, hobby.id)}
                preventSwipe={['up', 'down']}
                style={{ 
                  position: 'absolute', 
                  width: '100%',
                  zIndex: index,
                  visibility: index >= currentIndex ? 'visible' : 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <SwipeCard hobby={hobby} />
                  {index === currentIndex && (
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleGoToDetail(hobby.id);
                      }}
                      sx={{ 
                        position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
                        bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: 2, px: 3,
                        fontWeight: 'bold', zIndex: 10, backdropFilter: 'blur(4px)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                      }}
                    >
                      詳しく見る
                    </Button>
                  )}
                </Box>
              </TinderCard>
            )).reverse()
          )}
        </Box>

        {!isComplete && (
            <Stack direction="row" spacing={6} justifyContent="center" sx={{ mt: 2 }}>
                <IconButton 
                  onClick={() => onSwipe('left', hobbies[currentIndex]?.id)} 
                  sx={{ bgcolor: '#fff', p: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                >
                  <CloseIcon sx={{ fontSize: 35, color: REJECT_COLOR }} />
                </IconButton>
                <IconButton 
                  onClick={() => onSwipe('right', hobbies[currentIndex]?.id)} 
                  sx={{ bgcolor: '#fff', p: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                >
                  <FavoriteIcon sx={{ fontSize: 35, color: LIKE_COLOR }} />
                </IconButton>
            </Stack>
        )}
      </Container>
    </GradientBackground>
  );
};

export default Main;