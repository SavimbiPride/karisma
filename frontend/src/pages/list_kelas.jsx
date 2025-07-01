import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function ListKelas() {
  const [kelasList, setKelasList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKelas = kelasList.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/list-kelas');
        setKelasList(res.data);
      } catch (err) {
        console.error('Gagal mengambil data kelas:', err);
      }
    };

    fetchKelas();
  }, []);

  const handleDeleteClick = (kelas) => {
    setKelasToDelete(kelas);
    setShowNotif(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/kelas/${kelasToDelete.id}`);
      setKelasList(kelasList.filter((k) => k.id !== kelasToDelete.id));
      setShowNotif(false);
      setKelasToDelete(null);
    } catch (err) {
      console.error('Gagal menghapus kelas:', err);
      setShowNotif(false);
    }
  };

  const cancelDelete = () => {
    setShowNotif(false);
    setKelasToDelete(null);
  };

  const formatHarga = (harga) => {
    return parseInt(harga).toLocaleString('id-ID');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kelas', path: '/list_kelas' },
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
            message={`Yakin ingin menghapus kelas "${kelasToDelete?.judul}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-3xl font-bold mb-2">Manajemen Kelas</h1>
          <button
            onClick={() => navigate('/tambah_kelas')}
            className="bg-[#000045] hover:bg-[#1a1a80] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Tambah Kelas
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-[#000045] text-white">
              <tr>
                <th className="py-2 px-3">No</th>
                <th>Gambar</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Detail</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelasList.length > 0 ? (
                currentKelas.map((kelas, index) => (
                  <tr key={kelas.id} className="text-black border-b hover:bg-gray-100">
                    <td className="py-2 px-3">{indexOfFirstItem + index + 1}</td>
                    <td className="py-2">
                      <img
                        src={`http://localhost:5000/uploads/${kelas.image}`}
                        alt="gambar kelas"
                        className="w-14 h-14 object-cover mx-auto rounded"
                      />
                    </td>
                    <td className="py-2">{kelas.judul}</td>
                    <td className="py-2 max-w-xs text-justify px-2">{kelas.deskripsi}</td>
                    <td className="py-2">Rp {formatHarga(kelas.harga)}</td>
                    <td className="py-2">
                      <button
                        onClick={() => navigate(`/detail_kelas/${kelas.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Lihat Detail
                      </button>
                    </td>
                    <td className="py-2 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/edit_kelas/${kelas.id}`)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(kelas)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-gray-500">
                    Tidak ada data kelas.
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
              className={`text-black cursor-pointer ${indexOfLastItem >= kelasList.length ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => {
                if (indexOfLastItem < kelasList.length) {
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
