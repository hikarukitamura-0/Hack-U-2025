import React, { useState, useRef, useMemo, } from "react";
import {Box,} from '@mui/material';
import type { FC } from "react";
// @ts-ignore
import TinderCardImport from "react-tinder-card";

const TinderCard: any = TinderCardImport;

const DUMMY_DATA = [
  { name: "おしゃれな猫", description: "都会に住むスタイリッシュな猫の日常。", Category: "猫", catchPhrase: "猫の視点から見た世界。", cost: "1500円/月", images: ["https://placekitten.com/500/280"] },
  { name: "森のリス", description: "冬眠に備えて一生懸命に木の実を蓄えています。", Category: "リス", catchPhrase: "貯蓄のプロフェッショナル。", cost: "2000円（どんぐり代）", images: ["https://placedog.net/500/280?id=2"] },
  { name: "草原のウサギ", description: "広い草原を自由に駆け回る元気なウサギ。", Category: "ウサギ", catchPhrase: "スピードこそが正義。", cost: "2500円", images: ["https://placedog.net/500/280?id=3"] },
  { name: "UI/UXデザイン", description: "使い勝手の良いインターフェースを設計します。", Category: "デザイン", catchPhrase: "純粋な論理で『使いやすさ』をハックする。", cost: "ほぼゼロ（Figma無料、既存PC）", images: ["https://liginc.co.jp/wp-content/uploads/2018/08/eyecatch-1310x874.jpg"] },
];

const TinderSwipe: FC = () => {
  const db = DUMMY_DATA;
  const [lastDirection, setLastDirection] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<number>(db.length - 1);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo<any>(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef()),
    [db.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const swiped = (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (idx: number) => {
    console.log(`${idx} left the screen`);
  };

  const swipe = async (direction: string) => {
    if (currentIndex >= 0 && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(direction);
    }
  };

  const goBack = async () => {
    if (currentIndex >= db.length - 1) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <div style={styles.container}>
      <Box sx={{mt: -10}}/>
      <div style={styles.cardContainer}>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir: string) => swiped(dir, index)}
            onCardLeftScreen={() => outOfFrame(index)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{
                ...styles.card,
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%), url(${character.images[0]})`,
                zIndex: index, 
              }}
            >
              <div style={styles.textContainer}>
                <span style={styles.categoryBadge}>{character.Category}</span>
                <h3 style={styles.cardTitle}>{character.name}</h3>
                <p style={styles.catchPhrase}>{character.catchPhrase}</p>
                <div style={styles.details}>
                  <p style={styles.description}>{character.description}</p>
                  <p style={styles.costText}><strong>コスト:</strong> {character.cost}</p>
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => swipe("left")}>👎</button>
        <button style={styles.button} onClick={() => goBack()}>戻す</button>
        <button style={styles.button} onClick={() => swipe("right")}>👍</button>
      </div>

      <div style={styles.infoContainer}>
        {lastDirection ? <p style={styles.infoText}>判定: {lastDirection === 'right' ? 'お気に入り' : 'スキップ'}</p> : <p style={styles.infoText}>左右にスワイプ！</p>}
        {currentIndex < 0 && <strong style={{color: '#ff4d4f'}}>すべてのカードをチェックしました！</strong>}
      </div>
      <Box sx={{mb: -10}}/>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa', fontFamily: '"Helvetica Neue", Arial, sans-serif' },
  cardContainer: { position: 'relative', width: '105vw', height: '150vw' },
  card: { position: 'absolute', width: '105vw', height: '150vw', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '15px', boxShadow: '0px 15px 35px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'flex-end', boxSizing: 'border-box', backgroundColor: '#fff', overflow: 'hidden' },
  textContainer: { padding: '20px', color: '#fff', width: '100%', boxSizing: 'border-box' },
  categoryBadge: { backgroundColor: '#d21dffff', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'inline-block' },
  cardTitle: { fontSize: '40px', margin: '0 0 5px 0', fontWeight: 'bold' },
  catchPhrase: { fontSize: '16px', margin: '0 0 15px 0', color: '#e0e0e0', fontStyle: 'italic' },
  details: { borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px' },
  description: { fontSize: '13px', margin: '0 0 8px 0', lineHeight: '1.4' },
  costText: { fontSize: '13px', margin: 0, color: '#ffd700' },
  buttonContainer: { marginTop: '30px', display: 'flex', gap: '15px', zIndex: 1000 },
  button: { width: '70px', height: '50px', borderRadius: '25px', border: 'none', backgroundColor: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' },
  infoContainer: { marginTop: '20px', textAlign: 'center', minHeight: '60px' },
  infoText: { color: '#888', fontSize: '14px' }
};

export default TinderSwipe;