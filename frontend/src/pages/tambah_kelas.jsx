import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function TambahKelas() {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [namaPengajar, setNamaPengajar] = useState('');
  const [fotoPengajar, setFotoPengajar] = useState(null);
  const [previewFotoPengajar, setPreviewFotoPengajar] = useState(null);
  const [gambarKelas, setGambarKelas] = useState(null);
  const [previewGambarKelas, setPreviewGambarKelas] = useState(null);
  const [tools, setTools] = useState([{ judul: '', deskripsi: '', image: '', preview: null }]);
  const [sesi, setSesi] = useState([
    {
      judul: '',
      topik: '',
      video: null,
      preview: null,
      tugas: '',
      quiz: {
        soal: '',
        jawaban: ['', '', '', ''],
        benar: null,
      },
    },
  ]);

  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifGagal, setNotifGagal] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      judul.trim() === '' ||
      deskripsi.trim() === '' ||
      harga.trim() === '' ||
      namaPengajar.trim() === '' ||
      !fotoPengajar ||
      !gambarKelas
    ) {
      setNotifMessage('Harap lengkapi semua field ya :3');
      setNotifGagal(true);
      return;
    }

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('harga', harga);
    formData.append('nama_pengajar', namaPengajar);

    formData.append('foto_pengajar', fotoPengajar);
    formData.append('gambar_kelas', gambarKelas);

    // Kirim tools JSON (judul, deskripsi saja)
    formData.append('tools', JSON.stringify(
      tools.map(({ judul, deskripsi }) => ({ judul, deskripsi }))
    ));

    // Upload semua gambar tools sebagai array tools_images[]
    tools.forEach(tool => {
      if (tool.image) {
        formData.append('tools_images', tool.image);
      }
    });

    // Kirim sesi JSON
    formData.append('sesi', JSON.stringify(
      sesi.map(s => ({
        judul: s.judul,
        topik: s.topik,
        tugas: s.tugas,
        quiz: s.quiz
      }))
    ));

    // Upload semua video sesi sebagai array sesi_videos[]
    sesi.forEach(s => {
      if (s.video) {
        formData.append('sesi_videos', s.video);
      }
    });

    try {
      await axios.post('http://localhost:5000/api/kelas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNotifSuccess(true);
    } catch (err) {
      console.error('Gagal:', err);
      setNotifMessage('Gagal menambahkan kelas. Coba lagi nanti.');
      setNotifGagal(true);
    }
  };


  const handleOkSuccess = () => {
    setNotifSuccess(false);
    navigate('/list_kelas');
  };

  const handleOkGagal = () => {
    setNotifGagal(false);
  };

  return (
    <div className="flex min-h-screen min-w-screen">
      <main className="flex-1 bg-[#0a0a57] p-8 overflow-auto text-black">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Tambah Kelas</h2>

          {notifSuccess && (
            <NotifikasiCustom
              message="Kelas berhasil ditambahkan!"
              onConfirm={handleOkSuccess}
              singleButton={true}
            />
          )}

          {notifGagal && (
            <NotifikasiCustom
              message={notifMessage}
              onConfirm={handleOkGagal}
              singleButton={true}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label>Judul Kelas</label>
            <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="border p-2 w-full rounded" />

            <label>Deskripsi Kelas</label>
            <input type="text" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="border p-2 w-full rounded" />

            <label>Harga Kelas</label>
            <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} className="border p-2 w-full rounded" />

            <label>Nama Pengajar</label>
            <input type="text" value={namaPengajar} onChange={(e) => setNamaPengajar(e.target.value)} className="border p-2 w-full rounded" />

            <label>Foto Pengajar</label>
            <input type="file" onChange={(e) => {
              const file = e.target.files[0];
              setFotoPengajar(file);
              setPreviewFotoPengajar(URL.createObjectURL(file));
            }} className="cursor-pointer border p-2 w-full rounded" />
            {previewFotoPengajar && (
              <img src={previewFotoPengajar} alt="Preview Pengajar" className="w-32 h-32 object-cover rounded mt-2" />
            )}

            <label>Gambar Kelas</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              setGambarKelas(file);
              setPreviewGambarKelas(URL.createObjectURL(file));
            }} className="cursor-pointer border p-2 w-full rounded" />
            {previewGambarKelas && (
              <img src={previewGambarKelas} alt="Preview Gambar Kelas" className="w-48 h-28 object-cover rounded border mt-2" />
            )}

            <h3 className="text-lg font-semibold">Tools</h3>
            {tools.map((tool, i) => (
              <div key={i} className="border p-3 space-y-2 rounded">
                <label>Judul Tools</label>
                <input type="text" value={tool.judul} onChange={(e) => {
                  const newTools = [...tools];
                  newTools[i].judul = e.target.value;
                  setTools(newTools);
                }} className="border p-2 w-full rounded" />

                <label>Deskripsi Tools</label>
                <input type="text" value={tool.deskripsi} onChange={(e) => {
                  const newTools = [...tools];
                  newTools[i].deskripsi = e.target.value;
                  setTools(newTools);
                }} className="border p-2 w-full rounded" />

                <label>Gambar Tools</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  const newTools = [...tools];
                  newTools[i].image = file;
                  newTools[i].preview = URL.createObjectURL(file);
                  setTools(newTools);
                }} className="border p-2 w-full rounded cursor-pointer" />
                {tool.preview && (
                  <img src={tool.preview} alt="Preview Tool" className="w-32 h-32 object-cover rounded" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    const newTools = [...tools];
                    newTools.splice(i, 1);
                    setTools(newTools);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Hapus Tool
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setTools([...tools, { judul: '', deskripsi: '', image: null, preview: null }])} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"><FaPlus /> Tambah Tool</button>

            <h3 className="text-lg font-semibold">Sesi</h3>
            {sesi.map((s, i) => (
              <div key={i} className="border p-3 space-y-2 rounded">
                <label>Judul Sesi</label>
                <input type="text" value={s.judul} onChange={(e) => {
                  const newSesi = [...sesi];
                  newSesi[i].judul = e.target.value;
                  setSesi(newSesi);
                }} className="border p-2 w-full rounded" />

                <label>Topik</label>
                <input type="text" value={s.topik} onChange={(e) => {
                  const newSesi = [...sesi];
                  newSesi[i].topik = e.target.value;
                  setSesi(newSesi);
                }} className="border p-2 w-full rounded" />

                <label>Video</label>
                <input type="file" accept="video/*" onChange={(e) => {
                  const file = e.target.files[0];
                  const newSesi = [...sesi];
                  newSesi[i].video = file;
                  newSesi[i].preview = URL.createObjectURL(file);
                  setSesi(newSesi);
                }} className="border p-2 w-full rounded cursor-pointer"/>
                {s.preview && (
                  <video controls src={s.preview} className="w-150 h-100 rounded mt-2" />
                )}

                <label>Tugas</label>
                <textarea value={s.tugas} onChange={(e) => {
                  const newSesi = [...sesi];
                  newSesi[i].tugas = e.target.value;
                  setSesi(newSesi);
                }} className="border p-2 w-full rounded" />

                <label>Soal Quiz</label>
                <input type="text" value={s.quiz.soal} onChange={(e) => {
                  const newSesi = [...sesi];
                  newSesi[i].quiz.soal = e.target.value;
                  setSesi(newSesi);
                }} className="border p-2 w-full rounded" />

                {s.quiz.jawaban.map((j, jIndex) => (
                <div key={jIndex} className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name={`jawaban_benar_${i}`}
                    checked={s.quiz.benar === jIndex}
                    onChange={() => {
                      const newSesi = [...sesi];
                      newSesi[i].quiz.benar = jIndex;
                      setSesi(newSesi);
                    }}
                    className="cursor-pointer"
                  />
                  <input
                    type="text"
                    value={j}
                    onChange={(e) => {
                      const newSesi = [...sesi];
                      newSesi[i].quiz.jawaban[jIndex] = e.target.value;
                      setSesi(newSesi);
                    }}
                    placeholder={`Jawaban ${jIndex + 1}`}
                    className="border p-2 w-full rounded"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newSesi = [...sesi];
                  newSesi.splice(i, 1);
                  setSesi(newSesi);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Hapus Sesi
              </button>
              </div>
            ))}
            <button type="button" onClick={() => setSesi([...sesi, {
              judul: '', topik: '', video: null, preview: null, tugas: '', quiz: { soal: '', jawaban: ['', '', '', ''] }
            }])} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"><FaPlus /> Tambah Sesi</button>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
              <button type="button" onClick={() => navigate('/list_kelas')} className="bg-gray-500 text-white px-4 py-2 rounded">Kembali</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
