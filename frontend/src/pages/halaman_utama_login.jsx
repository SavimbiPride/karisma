import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const instructors = [
  {
    id: 1,
    name: 'Profil Instruktur Desain Grafis',
    desc: 'Seorang profesional desain grafis dengan pengalaman mengajar 1 tahun. Dengan latar belakang pendidikan jurusan Desain Komunikasi Visual (DKV).',
    photo: 'mas ipan.png',
  },
  {
    id: 2,
    name: 'Profil Instruktur Desain Grafis',
    desc: 'Seorang profesional desain grafis dengan pengalaman mengajar 1 tahun. Dengan latar belakang pendidikan jurusan Desain Komunikasi Visual (DKV).',
    photo: 'mas ipan.png',
  },
  {
    id: 3,
    name: 'Profil Instruktur Desain Grafis',
    desc: 'Seorang profesional desain grafis dengan pengalaman mengajar 1 tahun. Dengan latar belakang pendidikan jurusan Desain Komunikasi Visual (DKV).',
    photo: 'mas ipan.png',
  },
  {
    id: 4,
    name: 'Profil Instruktur Desain Grafis',
    desc: 'Seorang profesional desain grafis dengan pengalaman mengajar 1 tahun. Dengan latar belakang pendidikan jurusan Desain Komunikasi Visual (DKV).',
    photo: 'mas ipan.png',
  },
];

export default function HomePage() {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (startIndex + 2 < instructors.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleInstructors = instructors.slice(startIndex, startIndex + 2);


  return (
    <>
      <main className="w-full px-4 py-12" style={{ backgroundColor: '#000045' }}>
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Asah Skillmu secara<br />Interaktif di Kelas
          </h1>

          <h4 className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl mb-4 w-fit">
            WEBINAR REGULER
          </h4>

          <p className="text-white mb-6">
            Program kelas reguler merupakan pelatihan online secara intensif dan live bersama dengan mentor berpengalaman. Materi Kursus dirancang secara terstruktur dari dasar hingga lanjut dengan standar industri terkini.
          </p>

          <ul className="grid grid-cols-2 gap-y-2 gap-x-6 text-white text-sm mb-6">
            <li className="flex items-center gap-2">
              <span className="material-icons text-white">check_circle</span>
              Belajar nyaman dimana aja
            </li>
            <li className="flex items-center gap-2">
              <span className="material-icons text-white">check_circle</span>
              Pelatihan siap kerja
            </li>
            <li className="flex items-center gap-2">
              <span className="material-icons text-white">check_circle</span>
              Instruktur berpengalaman
            </li>
            <li className="flex items-center gap-2">
              <span className="material-icons text-white">check_circle</span>
              Mendapat e-sertifikat
            </li>
          </ul>

          {/* Tombol di kiri */}
          <div className="flex gap-4">
            <button onClick={()=> navigate('/kelas_saya')} className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl mb-4 cursor-pointer">
              Kelas saya
            </button>
            <button onClick={()=> navigate('/daftar_kelas')} className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl mb-4 cursor-pointer">
              Daftar kelas
            </button>
          </div>
        </div>

        {/* Gambar di kanan */}
        <div className="flex justify-end">
          <img src="hero-image.png" alt="Interactive learning illustration" className="w-[300px] md:w-[400px] mx-auto rounded-xl shadow-md" />
        </div>
      </section>

        {/* Materi Pelatihan */}
        <section className="py-10 px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-white text-[#0a1045] rounded-full inline-block px-8 py-3 shadow-md mb-8">
            Materi Pelatihan
          </h2>

          <div className="bg-[#e6e6e6] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md max-w-4xl mx-auto">
            <img src="karisma.png" alt="Logo Karisma" className="w-40 md:w-60 rounded-xl shadow-md" />
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#0a1045]">Manipulasi Foto</h3>
              <p className="text-[#1a1a1a] max-w-md">
                Teknik mengedit gambar untuk mengubah atau meningkatkan elemen visualnya, sering kali untuk menciptakan efek yang dramatis atau estetika tertentu yang tidak ada dalam gambar asli
              </p>
            </div>
          </div>
        </section>
        <section className="mt-12 px-4">
          <div className="bg-[#5b5b77] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-10 shadow-md">
            {/* Gambar Maskot */}
            <img
              src="/1-24.png" // ganti dengan path gambar robot kamu
              alt="Robot Maskot"
              className="w-40 md:w-52 h-auto object-contain"
            />

            {/* Gambar Cover Guidebook */}
            <img src="/guidebook.png" className="w-44 md:w-60 h-auto rounded-xl shadow-lg"
            />

            {/* Deskripsi dan Tombol */}
            <div className="text-white max-w-md text-center md:text-left">
              <h4 className="font-bold text-2xl mb-3">Guide Book</h4>
              <p className="text-base leading-relaxed mb-5">
                Panduan praktis yang dirancang untuk membantu peserta dalam memahami pelaksanaan pelatihan.
              </p>
              <a
                href="/public/GuideBook.pdf" // ganti dengan path file guide book kamu
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#0A0A57] font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition duration-200"
              >
                Buka Guide Book
              </a>
            </div>
          </div>
        </section>

        <section className="mt-12 px-4">
          <div className="bg-[#5b5b77] rounded-3xl p-6 flex items-center gap-4 justify-center shadow-md overflow-hidden">

            <button onClick={handlePrev} className="text-white bg-white/20 rounded-full p-2 disabled:opacity-50"disabled={startIndex === 0}
        >
          <span className="material-icons">chevron_left</span>
        </button>

        {/* Card */}
        <div className="flex gap-4 overflow-hidden">
  {visibleInstructors.map((ins) => (
    <div
      key={ins.id}
      className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white rounded-2xl p-4 w-[400px] shadow-md flex items-start gap-4"
    >
      {/* Foto kiri */}
      <img
        src={ins.photo}
        alt={ins.name}
        className="w-70 h-70 rounded-xl object-cover"
      />

      {/* Info pengajar */}
      <div className="flex flex-col">
        <h4 className="font-bold text-lg mb-1">{ins.name}</h4>
        <p className="text-sm leading-snug">{ins.desc}</p>
      </div>
    </div>
  ))}
</div>


        {/* Tombol kanan */}
        <button
          onClick={handleNext}
          className="text-white bg-white/20 rounded-full p-2 disabled:opacity-50"
          disabled={startIndex + 3 >= instructors.length}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </section>
        
        {/* CTA Section */}
        <section className="relative mt-16 flex justify-center items-center">
          <div className="bg-white w-full max-w-5xl text-center py-10 px-4 rounded-t-[50px] rounded-b-[20px] shadow-xl">
            <h2 className="text-3xl font-bold text-[#0A0A57] mb-4">Lets Join !</h2>
            <p className="text-sm text-[#0A0A57] font-bold max-w-2xl mx-auto">
              Ambil langkah pertama menuju peningkatan keterampilan dan pengetahuan Anda. Jangan lewatkan
              kesempatan emas ini, Ayo gabung kursus sekarang dan raih masa depan cerah!
            </p>
          </div>
        </section>

      </main>
    </>
  );
}