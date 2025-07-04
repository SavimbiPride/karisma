import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/halaman_utama';
import Login from './pages/login';
import Register from './pages/register';
import HomePage from './pages/halaman_utama_login';
import DaftarKelas from './pages/daftar_kelas';
import DetailKelasBeli from './pages/detail_kelas_beli';
import AdminDashboard from './pages/dashboard_admin';
import ListAdmin from './pages/list_admin';
import TambahAdmin from './pages/tambah_admin';
import EditAdmin from './pages/editadmin';
import ListUser from './pages/list_user';
import EditUser from './pages/EditUser';
import ListKelas from './pages/list_kelas';
import TambahKelas from './pages/tambah_kelas';
import EditKelas from './pages/edit_kelas';
import DetailKelas from './pages/detail_kelas';
import EditProfile from './pages/EditProfile';
import ListMentor from './pages/list_mentor';
import TambahMentor from './pages/tambah_mentor';
import EditMentor from './pages/EditMentor';

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
    '/list_mentor',
    '/tambah_mentor',
    '/EditMentor',
    '/daftar_kelas',
  ];

  const hideNavbarDynamicPaths = [
    '/EditAdmin/:id',
    '/EditMentor/:id',
    '/EditUser/:id',
    '/edit_kelas/:id',
    '/detail_kelas/:id',
    '/detail_kelas_beli/:id',
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
        <Route path="/daftar_kelas" element={<DaftarKelas />} />
        <Route path="/detail_kelas_beli/:id" element={<DetailKelasBeli />} />

        {/* Admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/list_admin" element={<ListAdmin />} />
        <Route path="/tambah_admin" element={<TambahAdmin />} />
        <Route path="/EditAdmin/:id" element={<EditAdmin />} />
        <Route path="/list_user" element={<ListUser />} />
        <Route path="/EditUser/:id" element={<EditUser />} />
        <Route path="/list_kelas" element={<ListKelas />} />
        <Route path="/tambah_kelas" element={<TambahKelas />} />
        <Route path="/edit_kelas/:id" element={<EditKelas />} />
        <Route path="/detail_kelas/:id" element={<DetailKelas />} />
        <Route path="/list_mentor" element={<ListMentor />} />
        <Route path="/tambah_mentor" element={<TambahMentor />} />
        <Route path="/EditMentor/:id" element={<EditMentor />} />
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
