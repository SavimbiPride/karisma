import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotifikasiCustom from '../components/NotifikasiCustom';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    alamat: '',
    domisili: '',
    tanggal_lahir: '',
    foto: '',
  });

  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        if (userData.tanggal_lahir) {
          userData.tanggal_lahir = userData.tanggal_lahir.split('T')[0];
        }

        setForm(userData);
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
      }
    };

    fetchUser();

    // Cleanup preview object URL
    return () => {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }
      setNewPhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (newPhoto) {
      formData.append('foto', newPhoto);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/update-profile',
        formData
      );

      // Ambil nama file dari response
      if (response.data.foto) {
        localStorage.setItem('foto', response.data.foto);
      }

      localStorage.setItem('username', form.username);

      // Trigger update ke komponen lain (seperti Navbar)
      window.dispatchEvent(new Event('profileUpdated'));

      setNotifMessage('Profil berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      setNotifMessage('Gagal memperbarui profil.');
    } finally {
      setNotifVisible(true);
    }
  };

  const navigateBack = () => {
  const role = localStorage.getItem('role');
    if (role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/home');
    }
  };

  const closeNotif = () => setNotifVisible(false);

  return (
    <div className="min-h-screen w-screen bg-[#0a0a57] text-white flex justify-center items-center p-6 relative">
      {notifVisible && (
        <NotifikasiCustom
          message={notifMessage}
          onConfirm={closeNotif}
          singleButton={true}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-none grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Kolom Foto */}
        <div className="flex flex-col items-center justify-center">
          <img
            src={
              previewPhoto
                ? previewPhoto
                : form.foto
                ? `http://localhost:5000/uploads/${form.foto}`
                : '/default-avatar.png'
            }
            alt="Preview"
            className="w-40 h-40 rounded-full mb-4 object-cover shadow-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="p-2 border rounded cursor-pointer w-full"
          />
        </div>

        {/* Kolom Form */}
        <div className="flex flex-col gap-4">
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <label>Alamat</label>
          <input
            name="alamat"
            value={form.alamat || ''}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <label>Domisili</label>
          <input
            name="domisili"
            value={form.domisili || ''}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <label>Tanggal Lahir</label>
          <input
            type="date"
            name="tanggal_lahir"
            value={form.tanggal_lahir || ''}
            onChange={handleChange}
            className="p-2 border rounded cursor-pointer"
          />

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-[#0a0a57] hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer "
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={navigateBack}
              className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
