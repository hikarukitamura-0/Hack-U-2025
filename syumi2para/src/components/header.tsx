import {Toolbar, Box, AppBar, Button, Typography } from '@mui/material';
import { Settings } from 'lucide-react';
import logo from '../assets/logo_yoko.png';

const Header = () => {

  return (
    <Box sx={{}}>
      <AppBar
        position="static"
        sx={{
          background: '#000000ff',
          boxShadow: '0 5px 8px rgba(117, 240, 247, 0.3)',
          width:'100vm',
          padding: 1,
          borderBottom: 'white 1px solid'
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: '50px',
            
          }}
        >
          <Typography >
              <img className='logo' src={logo} alt='しゅみしゅみぱらだいす' 
              style={{width: '220px'}} />
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Button
              color="inherit"
              variant="text"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                alignItems: 'center',
                minWidth: 'auto',
                mx: -2
              }}
            >
              <Settings size={20} />
              <Typography variant="caption" sx={{ fontWeight: '0.6rem', lineHeight: 1 }}>
                Setting
              </Typography>
            </Button>
          </Box>

        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;