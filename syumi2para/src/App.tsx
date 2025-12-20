// App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './pages/home';
import HobbyDetailPageModern from './pages/syousai';
import Main from './pages/main';
import SwipePage from './pages/swipe';
import ItiranPage from './pages/itiran'; // 新設
import FinalMatchPage from './pages/finalmatch'; // 新設
import Liked from './pages/LikedListPage';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/syousai/:id" element={<HobbyDetailPageModern />} />
            <Route path="/swipe" element={<SwipePage />} />
            <Route path="/main" element={<Main />} />
            <Route path="/itiran" element={<ItiranPage />} />
            <Route path="/finalmatch" element={<FinalMatchPage />} />
            <Route path="/liked-list" element={<Liked />} /> 
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
export default App;