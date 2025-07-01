import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import NotifikasiCustom from '../components/NotifikasiCustom';

export default function EditKelas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    harga: '',
    nama_pengajar: '',
    foto_pengajar: '',
    image: '',
  });

  const [mentorList, setMentorList] = useState([]);
  const [tools, setTools] = useState([]);
  const [sesi, setSesi] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewFotoPengajar, setPreviewFotoPengajar] = useState(null);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifGagal, setNotifGagal] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  useEffect(() => {
    // Ambil data mentor dari backend
    axios.get('http://localhost:5000/api/list-mentor')
      .then((res) => {
        setMentorList(res.data); // asumsi: data = [{ nama: '', foto_pengajar_url: '' }, ...]
      })
      .catch((err) => {
        console.error('Gagal mengambil mentor:', err);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/kelas/${id}`).then((res) => {
      const data = res.data;
      setForm({
        judul: data.judul,
        deskripsi: data.deskripsi,
        harga: formatHarga(data.harga),
        nama_pengajar: data.nama_pengajar,
        foto_pengajar: data.foto_pengajar_url,
        image: data.image,
      });

      setTools((data.tools || []).map((t, index) => ({
        ...t,
        index,
        image: t.image,
        preview: `http://localhost:5000/uploads/${t.image}`,
      })));

      setSesi((data.sesi || []).map((s) => {
        const video = Array.isArray(s.video) && s.video.length > 0 ? s.video[0] : null;
        const tugasText = Array.isArray(s.tugas) && s.tugas.length > 0 ? s.tugas[0].soal_tugas : '';
        let quizSoal = '', quizJawaban = ['', '', '', ''], quizBenar = null;
        if (Array.isArray(s.quiz) && s.quiz.length > 0) {
          quizSoal = s.quiz[0].soal;
          quizJawaban = s.quiz[0].jawaban.map(j => j.teks);
          quizBenar = s.quiz[0].jawaban.findIndex(j => j.benar === true);
        }
        return {
          judul: s.judul_sesi || '',
          topik: s.topik || '',
          video: null,
          preview: video ? `http://localhost:5000/uploads/${video}` : null,
          tugas: tugasText,
          quiz: { soal: quizSoal, jawaban: quizJawaban, benar: quizBenar },
        };
      }));

      setPreviewImage(`http://localhost:5000/uploads/${data.image}`);
      setPreviewFotoPengajar(data.foto_pengajar_url);
    });
  }, [id]);

  const formatHarga = (angka) => new Intl.NumberFormat('id-ID').format(Number(angka));
  const parseHarga = (stringHarga) => stringHarga.replace(/\D/g, '');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      if (name === 'image') setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      if (name === 'harga') {
        const raw = value.replace(/\D/g, '');
        setForm({ ...form, [name]: formatHarga(raw) });
      } else {
        setForm({ ...form, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('judul', form.judul);
      data.append('deskripsi', form.deskripsi);
      data.append('harga', parseHarga(form.harga));
      data.append('nama_pengajar', form.nama_pengajar);
      data.append('foto_pengajar', form.foto_pengajar);
      if (form.image instanceof File) {
        data.append('image', form.image);
      } else {
        data.append('old_image', form.image);
      }

      const toolsData = tools.map(({ judul, deskripsi, image }) => ({
        judul,
        deskripsi,
        image: image instanceof File ? null : image,
      }));
      data.append('tools', JSON.stringify(toolsData));
      tools.forEach((tool, i) => {
        if (tool.image instanceof File) {
          data.append(`tools_image_${i}`, tool.image);
        }
      });

      const sesiData = sesi.map((s) => ({
        judul: s.judul,
        topik: s.topik,
        tugas: s.tugas,
        quiz: s.quiz,
      }));
      data.append('sesi', JSON.stringify(sesiData));
      sesi.forEach((s, i) => {
        if (s.video instanceof File) {
          data.append(`sesi_video_${i}`, s.video);
        }
      });

      await axios.put(`http://localhost:5000/api/kelas/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNotifSuccess(true);
    } catch (err) {
      console.error('Gagal update:', err);
      setNotifMessage('Gagal memperbarui kelas');
      setNotifGagal(true);
    }
  };

  const handleOkSuccess = () => {
    setNotifSuccess(false);
    navigate('/list_kelas');
  };
  const handleOkGagal = () => setNotifGagal(false);

  return (
    <div className="flex min-h-screen min-w-screen">
      <main className="flex-1 bg-[#0a0a57] p-8 overflow-auto text-black">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Kelas</h2>

          {notifSuccess && (
            <NotifikasiCustom
              message="Kelas berhasil diperbarui!"
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

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label>Judul Kelas</label>
              <input name="judul" value={form.judul} onChange={handleChange} className="w-full p-3 border rounded" />
            </div>

            <div>
              <label>Deskripsi</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="w-full p-3 border rounded" />
            </div>

            <div>
              <label>Harga</label>
              <input name="harga" value={form.harga} onChange={handleChange} className="w-full p-3 border rounded" />
            </div>

          <div>
            <label>Nama Pengajar</label>
              <select
                name="nama_pengajar"
                value={form.nama_pengajar}
                onChange={(e) => {
                  const selectedNama = e.target.value;
                  const selectedMentor = mentorList.find(m => m.username === selectedNama);
                  setForm({
                    ...form,
                    nama_pengajar: selectedNama,
                    foto_pengajar: selectedMentor ? selectedMentor.foto : '',
                  });
                  setPreviewFotoPengajar(selectedMentor ? `http://localhost:5000/uploads/${selectedMentor.foto}` : null);
                }}
                className="w-full p-3 border rounded"
              >
                <option value="">-- Pilih Mentor --</option>
                {mentorList.map((mentor) => (
                  <option key={mentor.id} value={mentor.username}>
                    {mentor.username}
                  </option>
                ))}
              </select>
          </div>
          <div>
            <label>Foto Pengajar</label>
            {previewFotoPengajar && (
              <img
                src={previewFotoPengajar}
                alt="Foto Pengajar"
                className="w-32 h-32 object-cover rounded mt-2 border"
              />
            )}
          </div>

            <h3 className="text-lg font-semibold">Tools</h3>
            {tools.map((tool, i) => (
              <div key={i} className="border p-3 space-y-2 rounded">
                <label>Judul Tools</label>
                <input value={tool.judul} onChange={(e) => {
                  const newTools = [...tools];
                  newTools[i].judul = e.target.value;
                  setTools(newTools);
                }} className="border p-2 w-full rounded" />

                <label>Deskripsi Tools</label>
                <input value={tool.deskripsi} onChange={(e) => {
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
                <input value={s.judul} onChange={(e) => {
                  const newSesi = [...sesi];
                  newSesi[i].judul = e.target.value;
                  setSesi(newSesi);
                }} className="border p-2 w-full rounded" />

                <label>Topik</label>
                <input value={s.topik} onChange={(e) => {
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
                }} className="border p-2 w-full rounded cursor-pointer" />
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
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
              >
                Hapus Sesi
              </button>
              </div>
            ))}
            <button type="button" onClick={() => setSesi([...sesi, {
              judul: '', topik: '', video: null, preview: null, tugas: '', quiz: { soal: '', jawaban: ['', '', '', ''], benar: null }
            }])} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"><FaPlus /> Tambah Sesi</button>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Simpan Perubahan</button>
              <button type="button" onClick={() => navigate('/list_kelas')} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Kembali</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
