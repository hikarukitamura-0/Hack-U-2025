import { Box, Typography, Link } from '@mui/material';
import logo from '../assets/logo_yoko.png';
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // スムーズにスクロール
    });
  };

  return (
    <Box sx={{}}>
      <Box
        position="static"
        sx={{
          background: '#000000ff',
          boxShadow: '0 5px -8px rgba(117, 240, 247, 0.3)',
          width:'100vw',
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
        <Typography variant="body1" color="white"
          sx={{
            mb: 3 ,
            marginTop: 1,
            marginBottom: 1,
            fontWeight: 700
          }}>
          コンテンツ
        </Typography>
        
        <Box>
          <Link
            component={RouterLink}
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
            component={RouterLink}
            to="/syousai"
            sx={{
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              marginBottom: 1,
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