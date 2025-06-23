import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/halaman_utama';
import Login from './pages/login';
import Register from './pages/register';
import HomePage from './pages/halaman_utama_login';
import Navbar from './components/navbar';

function AppContent() {
  const location = useLocation();

  // Halaman yang tidak ingin menampilkan Navbar
  const hideNavbarOn = ['/login', '/register'];
  const hideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />} 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
