// src/pages/ListMentor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function ListMentor() {
  const [mentors, setMentors] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState(null);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [showAddedNotif, setShowAddedNotif] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/list-mentor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(res.data);

        if (localStorage.getItem('notif_mentor_ditambahkan')) {
          setShowAddedNotif(true);
          setTimeout(() => {
            setShowAddedNotif(false);
            localStorage.removeItem('notif_mentor_ditambahkan');
          }, 3000);
        }
      } catch (err) {
        console.error('Gagal mengambil data mentor:', err);
      }
    };
    fetchMentors();
  }, []);

  const handleDeleteClick = (mentor) => {
    setMentorToDelete(mentor);
    setShowNotif(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/mentor/${mentorToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors(mentors.filter((m) => m.id !== mentorToDelete.id));
      setShowNotif(false);
      setMentorToDelete(null);
      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 3000);
    } catch (err) {
      console.error('Gagal menghapus mentor:', err);
      setShowNotif(false);
    }
  };

  const cancelDelete = () => {
    setShowNotif(false);
    setMentorToDelete(null);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kelas', path: '/list_kelas' },
    { label: 'List admin', path: '/list_admin' },
    { label: 'List user', path: '/list_user' },
    { label: 'List mentor', path: '/list_mentor' },
  ];

  return (
    <div className="flex min-h-screen min-w-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#000045] text-white flex flex-col">
        <div className="flex items-center justify-center py-6 border-b border-gray-700">
          <img src="/Logo Karisma 2.png" alt="Logo" className="h-14" />
        </div>
        <nav className="flex-grow p-6 space-y-4 text-lg">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer px-4 py-2 rounded ${
                window.location.pathname === item.path
                  ? 'bg-white text-[#000045] font-semibold'
                  : 'hover:bg-white/20'
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto relative">
        {showNotif && (
          <NotifikasiCustom
            message={`Yakin ingin menghapus mentor "${mentorToDelete?.username}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-3xl font-bold">Manajemen Mentor</h1>
          <button
            onClick={() => {
              localStorage.setItem('notif_mentor_ditambahkan', 'true');
              navigate('/tambah_mentor');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
          >
            <FaPlus /> Tambah Mentor
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-[#000045] text-white">
              <tr>
                <th className="py-2 px-3">No</th>
                <th>Profile</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Alamat</th>
                <th>Domisili</th>
                <th>Tanggal Lahir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mentors.length > 0 ? (
                mentors.map((mentor, index) => (
                  <tr key={mentor.id} className="text-black border-b hover:bg-gray-100">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${mentor.foto}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </td>
                    <td>{mentor.username}</td>
                    <td>{mentor.email}</td>
                    <td>{mentor.alamat}</td>
                    <td>{mentor.domisili}</td>
                    <td>{mentor.tanggal_lahir?.split('T')[0]}</td>
                    <td className="flex justify-center gap-2 py-2">
                      <button
                        onClick={() => navigate(`/EditMentor/${mentor.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(mentor)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-gray-500">
                    Tidak ada data mentor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
