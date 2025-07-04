import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotifikasiCustom from '../components/NotifikasiCustom';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
    foto: ''
  });

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${id}`);
        const data = res.data;
        setForm(prev => ({
          ...prev,
          id: data.id,
          username: data.username,
          email: data.email,
          foto: data.foto || ''
        }));
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:5000/api/update-user-by-admin`, form);
      setNotifMessage('User berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      setNotifMessage('Gagal memperbarui user.');
    } finally {
      setNotifVisible(true);
    }
  };

  const closeNotif = () => {
    setNotifVisible(false);
    navigate('/list_user');
  };

  return (
    <div className="min-h-screen bg-[#0a0a57] text-white flex justify-center items-center p-6">
      {notifVisible && (
        <NotifikasiCustom
          message={notifMessage}
          onConfirm={closeNotif}
          singleButton={true}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              form.foto
                ? `http://localhost:5000/uploads/${form.foto}`
                : '/default-avatar.png'
            }
            alt="foto"
            className="w-32 h-32 rounded-full object-cover border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
          <input
            type="text"
            value={form.username}
            readOnly
            className="p-2 border rounded bg-gray-100 text-center w-full"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label>Password Baru</label>
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div className="flex gap-4 mt-4 justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate('/list_user')}
            className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
