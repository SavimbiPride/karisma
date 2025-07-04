import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('User');
  const [foto, setFoto] = useState('default-avatar.png');

  const loadProfileData = () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (token && userData) {
      setIsLogin(true);
      setUsername(userData.username || 'User');
      setFoto(userData.foto || 'default-avatar.png');
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    loadProfileData();

    const handleProfileUpdated = () => {
      loadProfileData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdated);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdated);
    };
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/EditProfile');
  };

  return (
    <nav className="bg-white text-black px-6 py-4 flex justify-between items-center shadow">
      <div className="font-bold text-xl">
        <img src="/Logo Karisma Academy.png" alt="Logo" className="h-12 w-auto" />
      </div>

      <div className="relative">
        {isLogin ? (
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-blue-950 rounded-2xl p-2 w-35 cursor-pointer"
            >
              <img
                src={`http://localhost:5000/uploads/${foto}?t=${Date.now()}`}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <span className="text-white font-semibold truncate">{username}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 mt-2 w-40 bg-blue-950 border rounded-xl shadow-lg z-10">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 hover:bg-gray-600 cursor-pointer bg-blue-950 text-white"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-600 cursor-pointer bg-blue-950"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-950 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600"
          >
            <strong>Login</strong>
          </button>
        )}
      </div>
    </nav>
  );
}
