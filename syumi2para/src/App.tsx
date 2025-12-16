import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Syousai from './pages/syousai';
import Main from './pages/main';
import Header from './components/header';
import Footer from './components/footer';
import Aisyou from './pages/aisyou';

function App() {
  return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/syousai" element={<Syousai />} />
          <Route path="/main" element={<Main />} />
          <Route path="/aisyou" element={<Aisyou />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;