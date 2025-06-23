import React, { useState } from 'react';

const instructors = [
  {
    id: 1,
    name: 'Profil Instruktur',
    specialty: 'Desain Grafis',
    description: (
      <>
        Seorang profesional desain grafis dengan pengalaman mengajar 1 tahun. Dengan latar belakang pendidikan jurusan Desain Komunikasi Visual (DKV).
      </>
    ),
    photo: 'mas ipan.png',
    alt: 'Portrait photo of instructor specialized in graphic design',
  },
  {
    id: 2,
    name: 'Profil Instruktur',
    specialty: 'Desain Grafis',
    description: (
      <>
        Bertugas memberikan ilmu yang relevan seperti Desain Grafis, Video Editing dan Ilustrasi menggunakan software Adobe Creative Suite.
      </>
    ),
    photo: 'mas ipan.png',
    alt: 'Portrait photo of instructor specialized in graphic design',
  },
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextInstructor = () => {
    setCurrentIndex((prev) => (prev === instructors.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <main className="w-full px-4 py-12" style={{ backgroundColor: '#000045' }}>
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Asah Skillmu secara<br />Interaktif di Kelas
            </h1>

            {/* Tombol Webinar Reguler */}
            <button className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md mb-4">
              WEBINAR REGULER
            </button>

            {/* Deskripsi */}
            <p className="text-white mb-6">
              Program kelas reguler merupakan pelatihan online secara intensif dan live bersama dengan mentor berpengalaman. Materi Kursus dirancang secara
              terstruktur dari dasar hingga lanjut dengan standar industri terkini.
            </p>

            {/* List dalam 2 kolom */}
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6 text-white text-sm">
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

          </div>
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
          <div className="bg-[#5b5b77] rounded-3xl p-6 flex items-center gap-4 overflow-x-auto">
            <button className="text-white bg-white/20 rounded-full p-2">
              <span className="material-icons">chevron_left</span>
            </button>
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white rounded-2xl p-4 min-w-[240px] shadow-md">
                <div class="grid grid-flow-col grid-rows-3 gap-4">
                  <div class="row-span-3"><img src="mas ipan.png" className="w-32 h-32 rounded-b-2xl mx-auto object-cover mb-4" /></div>
                  <div class="col-span-2"><h4 className="text-center font-bold mb-2">Profil Instruktur Desain Grafis</h4></div>
                  <div class="col-span-2 row-span-2"><p className="text-sm break-words">
                    Seorang profesional desain grafis dengan pengalaman mengajar 1 tahun. Dengan latar belakang pendidikan jurusan Desain Komunikasi Visual (DKV).
                  </p></div>
                </div>
              </div>
            ))}
            <button className="text-white bg-white/20 rounded-full p-2">
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