import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material'; // インポートをここに集約
import Home from './pages/home';
import HobbyDetailPageModern from './pages/syousai';
import Main from './pages/main';
import Header from './components/header';
import Footer from './components/footer';
import Aisyou from './pages/aisyou';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/syousai/:id" element={<HobbyDetailPageModern />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;