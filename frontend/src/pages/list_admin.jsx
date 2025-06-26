// src/pages/ListAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function ListAdmin() {
  const [admins, setAdmins] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [showAddedNotif, setShowAddedNotif] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/list-admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data);

        if (localStorage.getItem('notif_admin_ditambahkan')) {
          setShowAddedNotif(true);
          setTimeout(() => {
            setShowAddedNotif(false);
            localStorage.removeItem('notif_admin_ditambahkan');
          }, 3000);
        }
      } catch (err) {
        console.error('Gagal mengambil data admin:', err);
      }
    };
    fetchAdmins();
  }, []);

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowNotif(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/${adminToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((a) => a.id !== adminToDelete.id));
      setShowNotif(false);
      setAdminToDelete(null);
      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 3000);
    } catch (err) {
      console.error('Gagal menghapus admin:', err);
      setShowNotif(false);
    }
  };

  const cancelDelete = () => {
    setShowNotif(false);
    setAdminToDelete(null);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kelas', path: '/tambah_kelas' },
    { label: 'List admin', path: '/list_admin' },
    { label: 'List user', path: '/list_user' },
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
            message={`Yakin ingin menghapus admin "${adminToDelete?.username}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-3xl font-bold">Manajemen Admin</h1>
          <button
            onClick={() => {
              localStorage.setItem('notif_admin_ditambahkan', 'true');
              navigate('/tambah_admin');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Tambah Admin
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
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <tr key={admin.id} className="text-black border-b hover:bg-gray-100">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${admin.foto}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>{admin.alamat}</td>
                    <td>{admin.domisili}</td>
                    <td>{admin.tanggal_lahir?.split('T')[0]}</td>
                    <td className="flex justify-center gap-2 py-2">
                      <button
                        onClick={() => navigate(`/EditAdmin/${admin.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(admin)}
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
                    Tidak ada data admin.
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
