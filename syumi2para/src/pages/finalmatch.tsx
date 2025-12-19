import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import initialHobbiesData from '../data/hobbies.json';

// --- スタイル定義（元のUIを完全維持） ---
const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', py: 5, backgroundColor: '#f0f0f0' },
  infoContainer: { height: 40, mb: 2 },
  infoText: { color: '#888', fontSize: '14px' },
  cardContainer: { position: 'relative', width: '350px', height: '500px', maxWidth: '90vw' },
  motionWrapper: { position: 'absolute' as const, width: '100%', height: '100%', cursor: 'grab' },
  card: { 
    width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', 
    borderRadius: '20px', boxShadow: '0px 15px 35px rgba(0,0,0,0.15)', 
    display: 'flex', alignItems: 'flex-end', boxSizing: 'border-box', 
    backgroundColor: '#fff', overflow: 'hidden', border: '4px solid white'
  },
  textContainer: { padding: '20px', color: '#fff', width: '100%', boxSizing: 'border-box', textAlign: 'left' as const },
  categoryBadge: { backgroundColor: '#d21dffff', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'inline-block' },
  cardTitle: { fontSize: '32px', margin: '0 0 5px 0', fontWeight: 'bold', lineHeight: 1.2 },
  catchPhrase: { fontSize: '14px', margin: '0 0 15px 0', color: '#e0e0e0', fontStyle: 'italic' },
  details: { borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px' },
  description: { fontSize: '13px', margin: '0 0 8px 0', lineHeight: '1.4' },
  costText: { fontSize: '13px', margin: 0, color: '#ffd700' },
  buttonContainer: { marginTop: '40px', display: 'flex', gap: '20px' },
  button: { width: '70px', height: '50px', borderRadius: '25px', border: 'none', backgroundColor: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

const FinalSwipePage: React.FC = () => {
  const navigate = useNavigate();

  // 1. データ計算ロジック
  const recommendations = useMemo(() => {
    const saved = localStorage.getItem('user_yes_indices');
    const yesIndices = saved ? JSON.parse(saved) : [];

    const all = Object.entries(initialHobbiesData).map(([id, data]: [string, any]) => {
      let score = 0;
      if (data.category_id === 'digital_tech' && yesIndices.some((i: any) => [0,1,2,3].includes(i))) score += 20;
      if (data.category_id === 'creative' && yesIndices.some((i: any) => [4,5,6].includes(i))) score += 15;
      
      return { 
        id, 
        name: data.name_ja, 
        description: data.description,
        Category: data.category_id,
        catchPhrase: data.catch_phrase || "おすすめの趣味です",
        cost: data.cost_avg || "予算は内容によります",
        images: [data.image_url || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500"],
        score 
      };
    });
    return all.sort((a, b) => b.score - a.score).slice(0, 20).reverse();
  }, []);

  // 2. ステート管理
  const [cards, setCards] = useState(recommendations);
  const [history, setHistory] = useState<typeof recommendations>([]);
  const [likedHobbies, setLikedHobbies] = useState<typeof recommendations>([]);
  const [lastDirection, setLastDirection] = useState<string>("");
  const [exitX, setExitX] = useState<number>(0);

  // 3. 自動遷移の監視
  // 全てのカードのスワイプが終わったら、likedHobbiesを持ってリストページへ移動
  useEffect(() => {
    if (cards.length === 0 && recommendations.length > 0) {
      const timer = setTimeout(() => {
        navigate('/liked-list', { state: { likedHobbies } });
      }, 800); // アニメーション終了を待つためのディレイ
      return () => clearTimeout(timer);
    }
  }, [cards, likedHobbies, navigate, recommendations.length]);

  // 4. スワイプ処理
  const handleSwipe = (item: typeof recommendations[0], direction: 'left' | 'right') => {
    setExitX(direction === 'right' ? 600 : -600);
    setLastDirection(direction);
    setHistory((prev) => [...prev, item]);

    if (direction === 'right') {
      setLikedHobbies((prev) => [...prev, item]);
    }

    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== item.id));
    }, 10);
  };

  // 5. 戻す処理
  const undoSwipe = () => {
    if (history.length === 0) return;
    const lastItem = history[history.length - 1];

    setLikedHobbies((prev) => prev.filter((item) => item.id !== lastItem.id));
    setHistory((prev) => prev.slice(0, -1));
    setCards((prev) => [...prev, lastItem]);
    setLastDirection("");
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.infoContainer}>
        {cards.length > 0 ? (
          lastDirection ? (
            <Typography sx={{ ...styles.infoText, color: lastDirection === 'right' ? '#ff4081' : '#555', fontWeight: 'bold', fontSize: '20px' }}>
              判定: {lastDirection === 'right' ? 'LIKE! ❤️' : 'NOPE... 💔'}
            </Typography>
          ) : (
            <Typography sx={styles.infoText}>左右にスワイプ！ (残り {cards.length} 枚)</Typography>
          )
        ) : (
          <Typography sx={{ ...styles.infoText, color: '#d21dff', fontWeight: 'bold' }}>マッチング完了！転送中...</Typography>
        )}
      </Box>

      <Box sx={styles.cardContainer}>
        <AnimatePresence mode="popLayout">
          {cards.map((character) => (
            <motion.div
              key={character.id}
              style={styles.motionWrapper}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handleSwipe(character, 'right');
                else if (info.offset.x < -100) handleSwipe(character, 'left');
              }}
              whileTap={{ scale: 1.02 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ 
                x: exitX, 
                opacity: 0, 
                rotate: exitX / 20, 
                transition: { duration: 0.3 } 
              }}
            >
              <Box
                sx={{
                  ...styles.card,
                  backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%), url(${character.images[0]})`,
                }}
              >
                <Box sx={styles.textContainer}>
                  <Box component="span" sx={styles.categoryBadge}>{character.Category}</Box>
                  <Typography variant="h3" sx={styles.cardTitle}>{character.name}</Typography>
                  <Typography sx={styles.catchPhrase}>{character.catchPhrase}</Typography>
                  <Box sx={styles.details}>
                    <Typography sx={styles.description}>{character.description}</Typography>
                    <Typography sx={styles.costText}><strong>コスト:</strong> {character.cost}</Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      <Box sx={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1], 'left')}
          disabled={cards.length === 0}
        >
          👎
        </button>
        <button 
          style={{ ...styles.button, opacity: history.length === 0 ? 0.5 : 1 }} 
          onClick={undoSwipe}
          disabled={history.length === 0 || cards.length === 0}
        >
          <span style={{color:"black", fontSize:"12px"}}>戻す</span>
        </button>
        <button 
          style={{ ...styles.button, color: '#ff4081' }} 
          onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1], 'right')}
          disabled={cards.length === 0}
        >
          ❤️
        </button>
      </Box>
    </Box>
  );
};

export default FinalSwipePage;