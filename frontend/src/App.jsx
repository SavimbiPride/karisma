import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/halaman_utama';
import Login from './pages/login';
import Register from './pages/register';
import HomePage from './pages/halaman_utama_login';
import AdminDashboard from './pages/dashboard_admin';
import ListAdmin from './pages/list_admin';
import TambahAdmin from './pages/tambah_admin';
import EditAdmin from './pages/EditAdmin';
import ListUser from './pages/list_user';
import ListKelas from './pages/list_kelas';
import TambahKelas from './pages/tambah_kelas';
import EditKelas from './pages/edit_kelas';
import DetailKelas from './pages/detail_kelas';
import EditProfile from './pages/EditProfile';

// Components
import Navbar from './components/navbar';

function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = [
    '/login',
    '/register',
    '/dashboard',
    '/list_user',
    '/list_admin',
    '/EditProfile',
    '/tambah_admin',
    '/list_kelas',
    '/tambah_kelas',
  ];

  const hideNavbarDynamicPaths = [
    '/EditAdmin/:id',
    '/edit_kelas/:id',
    '/detail_kelas/:id',
  ];

  // Cek path statis
  const hideStatic = hideNavbarPaths.includes(location.pathname);

  // Cek path dinamis
  const hideDynamic = hideNavbarDynamicPaths.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  const hideNavbar = hideStatic || hideDynamic;

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
        <Route path="/list_kelas" element={<ListKelas />} />
        <Route path="/tambah_kelas" element={<TambahKelas />} />
        <Route path="/edit_kelas/:id" element={<EditKelas />} />
        <Route path="/detail_kelas/:id" element={<DetailKelas />} />
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
