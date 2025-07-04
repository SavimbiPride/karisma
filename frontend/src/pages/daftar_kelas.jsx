import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';

export default function ExploreKelas() {
  const navigate = useNavigate();
  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/list-kelas'); // sesuaikan endpoint-nya
        setKelasList(res.data);
      } catch (err) {
        console.error('Gagal mengambil data kelas:', err);
      }
    };

    fetchKelas();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A57] text-white p-6">
      <div className="mt-6 p-3">
        <h2 className="text-center text-2xl font-bold text-[#0A0A57] bg-[#f0f0f0] py-3 rounded-full max-w-md mx-auto">
          Explore Kelas
        </h2>
      </div>

      {/* Card List */}
      <div className="space-y-6 mt-6">
        {kelasList.map((kelas) => (
          <div
            key={kelas.id}
            className="bg-[#f2f2f2] text-[#112151] rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-md"
          >
            <img
              src={`http://localhost:5000/uploads/${kelas.image}`} // sesuaikan path gambar
              alt={kelas.judul}
              className="w-40 md:w-56 rounded-lg shadow object-cover"
            />
            <div className="flex-1 text-left">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{kelas.judul}</h2>
              <p className="text-sm mb-4">{kelas.deskripsi}</p>
                <button
                onClick={() => navigate(`/detail_kelas_beli/${kelas.id}`)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition"
                >
                <FaEye /> Detail
                </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={() => navigate('/home')}
          className="bg-blue-600 hover:bg-blue-950 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer">
          Kembali
        </button>
      </div>
    </div>
  );
}
