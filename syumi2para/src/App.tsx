import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Syousai from './pages/syousai';
import Header from './components/header';

function App() {
  return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/syousai" element={<Syousai />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;