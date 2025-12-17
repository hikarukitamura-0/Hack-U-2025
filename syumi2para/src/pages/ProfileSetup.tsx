import React, { useState } from 'react';
import { db, auth } from '../firebase'; // 作成したfirebase.tsからインポート
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Stack, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';

const ProfileSetup: React.FC = () => {
  const [genre, setGenre] = useState('fps');
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!auth.currentUser) return;

    // Firestoreの users/{UID} にデータを保存
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      game_genre: genre,
      setup_completed: true,
      updatedAt: new Date()
    }, { merge: true });

    alert("設定を保存しました！");
    navigate('/'); // メインのスワイプ画面へ移動
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        初期設定
      </Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>
        あなたの好みに合わせて趣味を分析します。
      </Typography>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            好きなゲームジャンルは？
          </Typography>
          <ToggleButtonGroup
            value={genre}
            exclusive
            onChange={(_, val) => val && setGenre(val)}
            fullWidth
          >
            <ToggleButton value="fps">FPS</ToggleButton>
            <ToggleButton value="puzzle">パズル</ToggleButton>
            <ToggleButton value="rpg">RPG</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Button 
          variant="contained" 
          size="large" 
          onClick={handleSave}
          sx={{ bgcolor: '#000', py: 2, borderRadius: 4 }}
        >
          はじめる
        </Button>
      </Stack>
    </Container>
  );
};

export default ProfileSetup;