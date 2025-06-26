import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/halaman_utama';
import Login from './pages/login';
import Register from './pages/register';
import HomePage from './pages/halaman_utama_login';
import AdminDashboard from './pages/dashboard_admin';
import ListAdmin from './pages/list_admin';
import TambahAdmin from './pages/tambah_admin';
import EditAdmin from './pages/EditAdmin';
import ListUser from './pages/list_user';
import EditProfile from './pages/EditProfile';
import Navbar from './components/navbar';

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState('');

  // Sembunyikan Navbar di halaman tertentu (login, register, dan admin dashboard)
  const hideNavbarOn = [
  '/login',
  '/register',
  '/dashboard',
  '/list_user',
  '/list_admin',
  '/EditProfile',
  '/tambah_admin'
];

const hideNavbar =
  hideNavbarOn.includes(location.pathname) ||
  location.pathname.startsWith('/EditAdmin') ||
  location.pathname.startsWith('/dashboard') ||
  location.pathname.startsWith('/admin');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/EditProfile" element={<EditProfile />} />

        {/* Admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/list_admin" element={<ListAdmin />} />
        <Route path="/tambah_admin" element={<TambahAdmin />} />
        <Route path="/EditAdmin/:id" element={<EditAdmin />} />
        <Route path="/list_user" element={<ListUser />} />

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
