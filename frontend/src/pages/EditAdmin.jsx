// src/pages/EditAdmin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function EditAdmin() {
  const { id } = useParams();
  const [form, setForm] = useState({
    username: '',
    email: '',
    alamat: '',
    domisili: '',
    tanggal_lahir: '',
    foto: '',
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.tanggal_lahir) {
          data.tanggal_lahir = data.tanggal_lahir.split('T')[0];
        }

        setForm(data);
        setPreview(`http://localhost:5000/uploads/${data.foto}`);
      } catch (err) {
        console.error('Gagal memuat data admin:', err);
      }
    };

    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (newPhoto) {
      formData.append('foto', newPhoto);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setNotifMessage('Admin berhasil diperbarui!');
    } catch (err) {
      console.error('Gagal memperbarui admin:', err);
      setNotifMessage('Gagal memperbarui admin.');
    } finally {
      setNotifVisible(true);
    }
  };

  const closeNotif = () => {
    setNotifVisible(false);
    navigate('/list_admin');
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#0a0a57] flex justify-center items-center p-6">
      {notifVisible && (
        <NotifikasiCustom
          message={notifMessage}
          onConfirm={closeNotif}
          singleButton={true}
        />
      )}
      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <img src={preview} alt="Preview" className="w-40 h-40 rounded-full object-cover border" />
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="cursor-pointer border p-2 w-full rounded" />
        </div>
        <div className="flex flex-col gap-3">
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} className="p-2 border rounded" />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="p-2 border rounded" />

          <label>Alamat</label>
          <input name="alamat" value={form.alamat || ''} onChange={handleChange} className="p-2 border rounded" />

          <label>Domisili</label>
          <input name="domisili" value={form.domisili || ''} onChange={handleChange} className="p-2 border rounded" />

          <label>Tanggal Lahir</label>
          <input type="date" name="tanggal_lahir" value={form.tanggal_lahir || ''} onChange={handleChange} className="p-2 border rounded" />

          <div className="flex gap-4 mt-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
            <button type="button" onClick={() => navigate('/list_admin')} className="bg-gray-600 text-white px-4 py-2 rounded">Batal</button>
          </div>
        </div>
      </form>
    </div>
  );
}
