// src/pages/ListUser.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/list-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowNotif(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowNotif(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Gagal menghapus user:', err);
      setShowNotif(false);
    }
  };

  const cancelDelete = () => {
    setShowNotif(false);
    setUserToDelete(null);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kelas', path: '/tambah_kelas' },
    { label: 'List admin', path: '/list_admin' },
    { label: 'List user', path: '/list_user' },
  ];

  return (
    <div className="flex min-h-screen min-w-screen">
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

      <main className="flex-1 bg-gray-100 p-8 overflow-auto relative">
        {showNotif && (
          <NotifikasiCustom
            message={`Yakin ingin menghapus user "${userToDelete?.username}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        <h1 className="text-black text-3xl font-bold mb-2">Manajemen User</h1>
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
              {users.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className="text-black border-b hover:bg-gray-100">
                    <td className="py-2 px-3">{indexOfFirstItem + index + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${user.foto}`}
                        onError={(e) => (e.target.src = '/default-avatar.png')}
                        alt="profile"
                        className="w-10 h-10 rounded-full mx-auto object-cover"
                      />
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.alamat}</td>
                    <td>{user.domisili}</td>
                    <td>{user.tanggal_lahir?.split('T')[0]}</td>
                    <td className="flex justify-center gap-2 py-2">
                      <button
                        onClick={() => handleDeleteClick(user)}
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
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 pr-1 text-sm">
          <div className="flex items-center gap-2">
            <span
              className={`text-black cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </span>
            <span className="bg-[#000045] text-white px-2 py-1 rounded">{currentPage}</span>
            <span
              className={`text-black cursor-pointer ${indexOfLastItem >= users.length ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => {
                if (indexOfLastItem < users.length) {
                  setCurrentPage((prev) => prev + 1);
                }
              }}
            >
              &gt;
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
