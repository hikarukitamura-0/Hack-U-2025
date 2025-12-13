import {Toolbar, Box, AppBar, Button, Typography } from '@mui/material';
import { Settings } from 'lucide-react';

const Header = () => {

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          background: '#81BFDA',
          boxShadow: '0 5px 8px rgba(117, 240, 247, 0.3)',
          width:'100vm'
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: 'white 1px solid',
            minHeight: '50px',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            しゅみしゅみパラダイス
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
    </div>
  );
};

export default Header;