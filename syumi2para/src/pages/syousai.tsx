import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Palette,
  Code,
  AttachMoney,
  AccessTime,
  RocketLaunch,
  Lightbulb,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link as RouterLink } from "react-router-dom";

// カスタムカラー定義 (元のスタイルを踏襲しつつ、主にアクセントに使用)
const ACCENT_COLOR = '#000000ff'; // メインカラー（ブラック）
const HOVER_COLOR = '#d21dffff';  // アクセントカラー（マゼンタ/パープル）

// 1. クリーンな背景スタイル
const CleanBackground = styled(Box)(({ theme }) => ({
  // 背景を純粋な白に設定し、洗練された印象に
  background: theme.palette.mode === 'dark' ? '#121212' : '#ffffff', 
  minHeight: '100vh',
  padding: theme.spacing(4, 0), 
}));

// 2. セクションタイトルのスタイル (モダンでシャープなデザイン)
const SectionTitleStyle = {
  fontWeight: 800,
  fontSize: '1.8rem', // 大きめのフォントでインパクトを出す
  mt: 6, 
  mb: 1, // タイトルとサブ要素の距離を詰める
  color: ACCENT_COLOR,
};

// 3. データカードの基盤スタイル (影や枠線を排除し、余白で区切る)
const DataBoxStyle = {
  py: 2,
  px: 0,
  borderBottom: '1px solid #eee', // 軽い罫線で区切りを設ける
};

// 4. 移動時にページ最上部からスタート
  const Top = () => {
    window.scrollTo({
      top: 0,
    });
  };

// 趣味紹介データの定義
const hobbyData = {
  name: "UI/UXデザイン",
  icon: <Palette sx={{ fontSize: 60, color: ACCENT_COLOR }} />,
  tagline: "純粋な論理で『使いやすさ』をハックする。",
  overview: [
    { label: "得られるスキル", value: "論理思考, 問題解決, Figma操作, ユーザー分析", icon: <Code /> },
    { label: "高専との相性", value: "最高。プログラミング知識が、理想的なインターフェース設計に直結。", icon: <RocketLaunch /> },
    { label: "始める理由", value: "君の『不満』を、世界で通用する価値に変えられる。", icon: <Lightbulb /> },
  ],
  conditions: [
    { label: "初期費用", value: "ほぼゼロ（Figma無料、既存PC）", icon: <AttachMoney /> },
    { label: "活動場所", value: "インターネット環境があればどこでも", icon: <Code /> },
    { label: "時間効率", value: "短時間から始められ、ポートフォリオに直結", icon: <AccessTime /> },
  ],
  steps: [
    "Figmaを開く。まずはスマホの『電卓アプリ』を丸ごと模写し、ツールの感覚を掴む。",
    "高専の学内システムなど、身近な『不便』を一つ選び、どう改善できるかアイデアスケッチをする。",
    "アイデアをFigmaで簡単なワイヤーフレーム（骨組み）に起こし、プロトタイプとして動かしてみる。",
  ],
};

const HobbyDetailPageModern: React.FC = () => {
  return (
    <CleanBackground>
      {/* ContainerをmaxWidth="sm"に戻し、スマホでは適度な余白を確保 */}
      <Container maxWidth="sm" sx={{ p: { xs: 3, sm: 4 } }}> 
        <Stack spacing={8}>
          
          {/* 1. タイトル＆キャッチフレーズ (Minimal Header) */}
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            {hobbyData.icon}
            <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: ACCENT_COLOR, mt: 1, mb: 0.5 }}>
              {hobbyData.name}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, color: 'text.secondary', lineHeight: 1.8 }}>
              {hobbyData.tagline}
            </Typography>
            <Divider sx={{ bgcolor: ACCENT_COLOR, height: '1px', width: '30%', mx: 'auto', mt: 3 }} />
          </Box>

          {/* 2. メインCTA (余白を多く取り、目立たせる) */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<FavoriteBorderIcon />}
              component={RouterLink}
              onClick={Top}
              to="/aisyou"
              sx={{ 
                width: { xs: '100%', sm: '80%' }, // スマホで幅いっぱいに
                py: 2, 
                fontWeight: 700, 
                borderRadius: 4, 
                backgroundColor: ACCENT_COLOR,
                '&:hover': {
                  backgroundColor: HOVER_COLOR, // アクセントカラーはホバー時のみ
                }
              }}
            >
              いますぐ趣味との相性を知る
            </Button>
          </Box>
          
          {/* 3. 概要セクション (すっきりとしたリスト形式) */}
          <Box>
            <Typography variant="h4" sx={SectionTitleStyle}>
              おススメポイント
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              UI/UXデザインは、論理と創造性が交差する領域です。
            </Typography>

            <Stack spacing={0}>
              {hobbyData.overview.map((item, index) => (
                <Box key={index} sx={DataBoxStyle}>
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <ListItemIcon sx={{ color: HOVER_COLOR, minWidth: 30, mt: 0.5 }}>
                        {item.icon}
                    </ListItemIcon>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} color={ACCENT_COLOR}>
                            {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, mt: 0.5 }}>
                            {item.value}
                        </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
          
          {/* 4. コストと条件 (シンプルなキーバリュー表示) */}
          <Box>
            <Typography variant="h4" sx={SectionTitleStyle}>
              コストと活動条件
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              最小限の投資で、最大限のスキルアップを目指せます。
            </Typography>

            <Stack spacing={0}>
              {hobbyData.conditions.map((row, index) => (
                <Box key={index} sx={DataBoxStyle}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ListItemIcon sx={{ minWidth: 30, color: HOVER_COLOR }}>{row.icon}</ListItemIcon>
                      <Typography variant="body1" fontWeight={600} color={ACCENT_COLOR}>
                        {row.label}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {row.value}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* 5. ファーストステップ (番号とチップでシンプルに) */}
          <Box>
            <Typography variant="h4" sx={SectionTitleStyle}>
              ファーストステップ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              惰性を捨て、このシンプルなステップで行動を変えよう。
            </Typography>
            
            <List disablePadding>
              {hobbyData.steps.map((step, index) => (
                <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start', mb: 3 }}>
                  <Chip
                      label={`0${index + 1}`}
                      size="medium"
                      sx={{ 
                          fontWeight: 700, 
                          // 背景は白、枠線で強調
                          backgroundColor: '#ffffff', 
                          color: ACCENT_COLOR,
                          border: `1px solid ${ACCENT_COLOR}`,
                          mr: 2, 
                          mt: 0.5
                      }}
                  />
                  <ListItemText primary={step} primaryTypographyProps={{ fontWeight: 500, lineHeight: 1.7 }} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          {/* 6. 最後のCTA (底部) */}
          <Box sx={{ textAlign: 'center', pb: 4 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<FavoriteBorderIcon />}
              component={RouterLink}
              onClick={Top}
              to="/aisyou"
              sx={{ 
                width: '90%', 
                py: 1.5,
                fontWeight: 600, 
                borderRadius: 4, 
                color: ACCENT_COLOR,
                borderColor: ACCENT_COLOR,
                '&:hover': {
                  backgroundColor: `${ACCENT_COLOR}10`, // 薄いホバー効果
                  borderColor: ACCENT_COLOR,
                }
              }}
            >
              趣味との相性を知る
            </Button>
          </Box>
          
        </Stack>
      </Container>
    </CleanBackground>
  );
};

export default HobbyDetailPageModern;