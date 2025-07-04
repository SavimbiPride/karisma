import React, { useEffect, useState } from 'react';
import { FaComment, FaTools, FaBookOpen } from "react-icons/fa";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function DetailKelasUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);
  const [openSesi, setOpenSesi] = useState({});
  const [komentarInput, setKomentarInput] = useState('');
  const [listKomentar, setListKomentar] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/kelas/${id}`);
        setKelas(res.data);
      } catch (err) {
        console.error('Gagal mengambil detail kelas:', err);
      }
    };
    

    const fetchKomentar = async () => {
         try {
          const res = await axios.get(`http://localhost:5000/api/komentar/${id}`);
          console.log('Komentar:', res);
          setListKomentar(res.data.rows);
        } catch (err) {
          console.error('Gagal mengambil komentar:', err);
        } 
    };
 
    
    fetchKelas();
    fetchKomentar();
  }, [id]);

  const toggleSesi = (sesiId) => {
    setOpenSesi((prev) => ({ ...prev, [sesiId]: !prev[sesiId] }));
  };

  const handlePostKomentar = async () => {
    if (!komentarInput.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotifMessage('Silakan login terlebih dahulu.');
      setShowNotif(true);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/komentar',
        {
          id_kelas: id,
          isi: komentarInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Respon komentar:', res.data);

      if (res.data?.id) {
        setListKomentar((prev) => [res.data, ...prev]);
        setKomentarInput('');
        setNotifMessage('Komentar berhasil dikirim!');
        setShowNotif(true);
      } else {
        throw new Error('Respon komentar tidak valid');
      }
    } catch (err) {
      console.error('Gagal mengirim komentar:', err);
      setNotifMessage('Gagal mengirim komentar.');
      setShowNotif(true);
    }
  };

  const handleCloseNotif = () => {
    setShowNotif(false);
    setNotifMessage('');
  };

  if (!kelas) return <p className="text-white p-4">Memuat data kelas...</p>;

  return (
    <main className="min-h-screen bg-[#0a0a57] py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto bg-white text-[#0a0a57] p-6 rounded-xl shadow-lg">
        
        {/* Notifikasi Custom */}
        {showNotif && (
          <NotifikasiCustom
            message={notifMessage}
            onConfirm={handleCloseNotif}
            singleButton
          />
        )}

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">{kelas.judul}</h1>

        {/* Informasi Pengajar dan Gambar */}
        <div className="grid md:grid-cols-2 gap-6 items-start mb-8">
          <img
            src={`http://localhost:5000/uploads/${kelas.image}`}
            alt="gambar kelas"
            className="w-full rounded-xl object-cover shadow-md"
          />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Deskripsi</h3>
              <p className="text-sm text-gray-700">{kelas.deskripsi}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><GiPlagueDoctorProfile /> Profil Instruktur</h3>
              <div className="flex items-center gap-4">
                {kelas.foto_pengajar_url && (
                  <img
                    src={kelas.foto_pengajar_url}
                    alt="Foto Pengajar"
                    className="w-20 h-20 rounded-full object-cover border shadow"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-700 font-semibold">Pengajar:</p>
                  <p className="text-md">{kelas.nama_pengajar}</p>
                </div>
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition cursor-pointer">
              Beli, Rp {Number(kelas.harga).toLocaleString('id-ID')}
            </button>
          </div>
        </div>

        {/* TOOLS */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FaTools /> TOOLS</h2>
          {kelas.tools?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kelas.tools.map((tool) => (
                <div key={tool.id} className="flex gap-4 bg-[#eef2ff] p-4 rounded-lg shadow">
                  {tool.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${tool.image}`}
                      alt={tool.judul}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{tool.judul}</p>
                    <p className="text-sm text-gray-600">{tool.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada tools</p>
          )}
        </div>

        {/* SESI */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FaBookOpen /> SESI</h2>
          {kelas.sesi?.length > 0 ? (
            kelas.sesi.map((sesi, index) => (
              <div key={sesi.id} className="bg-[#eef2ff] rounded-xl mb-4 shadow-md">
                <button onClick={() => toggleSesi(sesi.id)} className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center cursor-pointer">
                  <span>{index + 1}. {sesi.judul_sesi}</span>
                  <span>{openSesi[sesi.id] ? '▲' : '▼'}</span>
                </button>
                {openSesi[sesi.id] && (
                  <div className="px-4 pb-4 text-sm text-gray-700">{sesi.topik}</div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Belum ada sesi.</p>
          )}
        </div>

        {/* KOMENTAR */}
        <div className="mt-10">
          <h3 className="text-lg font-bold gap-2 flex items-center mb-3"><FaComment /> Ulasan</h3>

          <div className="bg-blue-700 p-4 rounded-xl space-y-4">
            {/* Form Komentar */}
            <div className="flex overflow-hidden rounded-md bg-white w-full">
              <textarea
                className="flex-1 p-2 text-sm focus:outline-none"
                placeholder="Add a comment..."
                value={komentarInput}
                onChange={(e) => setKomentarInput(e.target.value)}
              />
              <button
                onClick={handlePostKomentar}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 font-semibold cursor-pointer"
              >
                Post
              </button>
            </div>

            {/* List Komentar */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {!listKomentar?.length ? (
                <p className="text-white text-sm">Belum ada komentar.</p>
              ) : (
                listKomentar.map((items, id) => (
                  <article
                    key={id}
                    className="flex items-start gap-3 bg-white text-[#0a0a57] p-3 rounded shadow"
                  >
                    <img
                      src={`http://localhost:5000/uploads/${items.foto || 'default-avatar.png'}`}
                      alt="avatar"
                      className="w-10 h-10 object-cover rounded-full border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div>
                      <p className="font-semibold">{items.username}</p>
                      <p className="text-sm">{items.isi}</p>
                      {items.dibuat && (
                        <p className="text-xs text-gray-500">
                          {new Date(items.dibuat).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/daftar_kelas')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </main>
  );
}
