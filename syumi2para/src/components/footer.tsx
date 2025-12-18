import { Box, Typography, Link } from '@mui/material';
import logo from '../assets/logo_yoko.png';
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const Top = () => {
    window.scrollTo({
      top: 0,
    });
  };

  // 「詳細」をクリックした時のハンドラー
  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    Top();

    // SessionStorageから直近の診断結果を取得
    const savedResult = sessionStorage.getItem('last_diagnostic_result');
    
    if (savedResult) {
      const parsed = JSON.parse(savedResult);
      const hobbyId = parsed.hobby?.id;
      if (hobbyId) {
        // 保存された趣味がある場合はその詳細ページへ
        navigate(`/syousai/${hobbyId}`, { 
          state: { syncRate: parsed.rate, reason: "前回の診断結果です。" } 
        });
        return;
      }
    }
    
    // 診断結果がない場合は、とりあえずメインページか診断開始へ誘導
    navigate('/main');
  };

  return (
    <Box sx={{}}>
      <Box
        position="static"
        sx={{
          background: '#000000ff',
          boxShadow: '0 5px -8px rgba(117, 240, 247, 0.3)',
          width: '100vw',
          padding: 3,
          borderTop: 'white 1px solid'
        }}
      >
        <Typography>
          <img className='logo' src={logo} alt='しゅみしゅみぱらだいす' 
          style={{width: '220px'}} />
        </Typography>
        <Typography variant="body2" color="white" 
          sx={{
            mb: 3 ,
            marginTop: 1
          }}>
          © 2025 ﾄｲﾚｯﾄﾍﾟｰﾊﾟｰﾌﾞﾗｼﾁｮｰｸﾏｲﾍﾟｯﾄ Inc.
        </Typography>
        <Box>
          <Link
            component={RouterLink}
            onClick={Top}
            to="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              marginBottom: 1,
            }}
          >
            ホーム
          </Link>
          <Link
            component="button" // ボタン形式にしてハンドラーで制御
            onClick={handleDetailClick}
            sx={{
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              marginBottom: 1,
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit'
            }}
          >
            詳細
          </Link>
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Link
            component="button"
            onClick={scrollToTop}
            sx={{
              color: 'white',
              fontWeight: 700,
              textDecoration: 'none', 
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            ▲ページ先頭へ戻る
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;