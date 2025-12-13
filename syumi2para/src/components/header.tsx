import {  Toolbar, Box, AppBar} from '@mui/material';


import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <AppBar position="static" 
    sx={{
      backgroundColor: '#ffffffff',
      display: 'flex', 
      alignItems: 'center' , 
      position: 'fixed' ,
      zIndex: (theme) => theme.zIndex.drawer + 1,
      }}>
      <Toolbar sx={{ width: '100%', display: 'flex', flexDirection: 'column'}} >

        <Box sx={{ transition: 'all 0.4s ease' }}>
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Box className="navlink-wrapper"
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
              }}>
              <Link to={'/about'} className="navlink"></Link>
            </Box>

            <Box className="navlink-wrapper"
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
              }}>
              <Link to={'/about'} className="navlink">記事 物理学系</Link>
            </Box>

            <Box className="navlink-wrapper"
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
              }}>
              <Link to={'/about'} className="navlink">電磁気学同好会</Link>
            </Box>

            <Box className="navlink-wrapper"
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
              }}>
              <Link to={'/about'} className="navlink">てきとう日記</Link>
            </Box>

            <Box className="navlink-wrapper"
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
              }}>
              <Link to={'/about'} className="navlink">なんでも提node出掲示板</Link>
            </Box>
          </Box>
        </Box>
      </Toolbar>
      <Box
      sx={{
        width:'100%',
        height:'20px',
        backgroundColor: 'rgba(0, 0, 0, 0.29)',
      }}
      />
    </AppBar>
  );
};

export default Header;