import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTools, FaBookOpen, FaVideo, FaTasks, FaQuestionCircle } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import axios from 'axios';

export default function DetailKelas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/kelas/${id}`);
        setKelas(res.data);
      } catch (err) {
        console.error('Gagal mengambil detail kelas:', err);
      }
    };
    fetchKelas();
  }, [id]);

  if (!kelas) return <p className="p-4 text-white">Memuat detail kelas...</p>;

  return (
    <main className="min-h-screen min-w-screen bg-[#0a0a57] py-10 px-4 md:px-10 text-black">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8">{kelas.judul}</h1>

        {/* Info Umum */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <img
              src={`http://localhost:5000/uploads/${kelas.image}`}
              alt="gambar kelas"
              className="w-full rounded-lg shadow"
            />
          </div>
          <div className="flex flex-col justify-center space-y-3">
            <p><strong>Deskripsi:</strong> {kelas.deskripsi}</p>
            <p><strong>Harga:</strong> Rp {Number(kelas.harga).toLocaleString('id-ID')}</p>
            <div className="mt-4 flex items-center gap-4">
              {kelas.foto_pengajar && (
                <img
                  src={`http://localhost:5000/uploads/${kelas.foto_pengajar}`}
                  alt="foto pengajar"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              )}
              <div>
                <p className="font-semibold">Pengajar:</p>
                <p>{kelas.nama_pengajar}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-700">
            <FaTools /> Tools
          </h2>
          {kelas.tools?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kelas.tools.map((tool) => (
                <div key={tool.id} className="flex gap-4 bg-gray-100 p-4 rounded-lg shadow">
                  <img
                    src={`http://localhost:5000/uploads/${tool.image}`}
                    alt={tool.judul}
                    className="w-16 h-16 object-cover rounded"
                  />
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
        </section>

        {/* Sesi */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-700">
            <FaBookOpen /> Sesi
          </h2>
          {kelas.sesi?.length > 0 ? (
            <div className="space-y-6">
              {kelas.sesi.map((sesi, idx) => (
                <div key={sesi.id} className="bg-gray-50 p-4 rounded shadow">
                  <p className="text-lg font-bold mb-1">{idx + 1}. {sesi.judul_sesi}</p>
                  <p className="text-sm text-gray-700 mb-3">Topik: {sesi.topik}</p>

                  {/* Video */}
                  {sesi.video?.length > 0 ? (
                    <div className="mt-4">
                      <h3 className="text-md font-semibold text-blue-700 flex items-center gap-2 mb-2">
                        <FaVideo /> Video
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sesi.video.map((v, vIdx) => (
                          <video key={vIdx} controls className="w-80 h-50 rounded shadow">
                            <source src={`http://localhost:5000/uploads/${sesi.video}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 ml-4">Tidak ada video</p>
                  )}

                  {/* Tugas */}
                  <div className="mb-2">
                    <h3 className="text-md font-semibold text-blue-700 flex items-center gap-2"><FaTasks /> Tugas</h3>
                    {sesi.tugas?.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {sesi.tugas.map((t, idx) => (
                          <li key={idx}>{t.soal_tugas}</li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-gray-500 ml-4">Tidak ada tugas</p>}
                  </div>

                  {/* Quiz */}
                  <div className="mt-4">
                  <h3 className="text-md font-semibold text-blue-700 flex items-center gap-2">
                    <FaQuestionCircle /> Quiz
                  </h3>

                  {Array.isArray(sesi.quiz) && sesi.quiz.length > 0 ? (
                    sesi.quiz.map((qz, qzIdx) => (
                      <div key={qzIdx} className="mt-2 ml-4">
                        <p className="font-semibold">Soal: {qz.soal}</p>
                        <ol className="list-decimal text-sm text-gray-700 mt-1 space-y-1">
                          {qz.jawaban.map((jwb, jIdx) => (
                            <li key={jIdx}>
                              <div className="flex items-center gap-2">
                                <span>{jwb.teks}</span>
                                {jwb.benar && (
                                  <span className="text-green-600 font-bold">
                                    <TiTick />
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 ml-4">Tidak ada quiz</p>
                  )}
                </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada sesi</p>
          )}
        </section>

        {/* Tombol Kembali */}
        <div className="text-center">
          <button
            onClick={() => navigate('/list_kelas')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Kembali
          </button>
        </div>
      </div>
    </main>
  );
}
