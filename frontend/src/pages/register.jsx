import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotifikasiCustom from '../components/NotifikasiCustom';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [notif, setNotif] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', form);
      setNotif({
        show: true,
        pesan: 'Registrasi berhasil!',
        tipe: 'ok',
        onTutup: () => {
          setNotif(null);
          navigate('/login');
        }
      });
    } catch (err) {
      setNotif({
        show: true,
        pesan: err.response?.data?.message || 'Terjadi kesalahan',
        tipe: 'ok',
        onTutup: () => setNotif(null)
      });
    }
  };

  return (
    <>
      {notif && notif.show && (
        <NotifikasiCustom
          message={notif.pesan}
          singleButton={true}
          buttonLabel="OK"
          onConfirm={notif.onTutup}
        />
      )}

      <div className="flex h-screen w-screen font-sans">
        {/* Kiri - Gambar Maskot */}
        <div className="hidden md:flex w-1/2 bg-[#0A0A57] items-center justify-center flex-col px-6 relative">
          <div className="absolute top-6 left-6">
            <img src="/Logo Karisma 2.png" alt="Logo" className="h-12" />
          </div>
          <img src="/maskot Karisma.png" alt="Maskot Karisma" className="h-auto object-contain mb-4" />
        </div>

        {/* Kanan - Form */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center h-screen">
          <h1 className="text-5xl font-bold text-[#0A0A57] mb-8 text-center">Sign Up</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <input
                type="text"
                id="username"
                className="peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 text-black"
                placeholder=" "
                value={form.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="username" className="absolute left-4 top-2 text-gray-500 text-sm">
                Username
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                className="peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 text-black"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email" className="absolute left-4 top-2 text-gray-500 text-sm">
                Email
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="password"
                id="password"
                className="peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 text-black"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password" className="absolute left-4 top-2 text-gray-500 text-sm">
                Password
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0A0A57] text-white font-semibold px-6 py-2 rounded-lg cursor-pointer"
              >
                <strong>Submit</strong>
              </button>
            </div>
            <div className="mt-4 text-lg">
              <span className="font-bold text-[#0A0A57]">Sudah punya akun? </span>
              <Link to="/login" className="text-[#0A0A57] underline cursor-pointer">Login sekarang</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
