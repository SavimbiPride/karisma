import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Admin');
  const [summary, setSummary] = useState({
    total_user: 0,
    total_kelas: 0
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('username') || 'Admin';
    setAdminName(name);

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
      } catch (err) {
        console.error('Gagal mengambil ringkasan data:', err);
      }
    };

    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('foto');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/EditProfile');
  };

  return (
    <div className="flex min-h-screen min-w-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#000045] text-white flex flex-col">
        <div className="flex items-center justify-center py-6 border-b border-gray-700">
          <img src="/Logo Karisma 2.png" alt="Logo" className="h-14" />
        </div>
        <nav className="flex-grow p-6 space-y-4 text-lg">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Kelas', path: '/list_kelas' },
            { label: 'List admin', path: '/list_admin' },
            { label: 'List user', path: '/list_user' },
            { label: 'List mentor', path: '/list_mentor' }
          ].map((item) => (
            <div key={item.label} onClick={() => {navigate(item.path); setDropdownOpen(false)}} className={`cursor-pointer px-4 py-2 rounded ${window.location.pathname === item.path ? 'bg-white text-[#000045] font-semibold' : 'hover:bg-white/20'}`}>
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center relative">
          <h1 className="text-4xl font-bold">Data Summary</h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-semibold bg-[#000045] text-white px-4 py-2 rounded-2xl cursor-pointer"
            >
              {adminName}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#000045] border rounded shadow z-20 text-white">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-[#000045] hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-indigo-300 text-gray-900 p-6 rounded-lg shadow relative">
            <div className="flex items-center gap-2">
              <span className="material-icons text-lg">info</span>
              <span className="font-bold">Total Kelas</span>
            </div>
            <p className="text-2xl mt-4 font-semibold">{summary.total_kelas} Kelas</p>
          </div>

          <div className="bg-indigo-400 text-gray-900 p-6 rounded-lg shadow relative">
            <div className="flex items-center gap-2">
              <span className="material-icons text-lg">info</span>
              <span className="font-bold">Total User</span>
            </div>
            <p className="text-2xl mt-4 font-semibold">{summary.total_user} User</p>
          </div>
        </div>
      </main>
    </div>
  );
}
