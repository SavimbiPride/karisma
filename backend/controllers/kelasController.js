const db = require('../db');
const path = require('path');

// Get List Kelas
exports.getListKelas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM kelas');
    res.json(results);
  } catch (err) {
    console.error('Gagal mengambil data kelas:', err);
    res.status(500).json({ message: 'Gagal mengambil data kelas' });
  }
};

// Tambah Kelas
exports.tambahKelas = async (req, res) => {
  try {
    const {
      judul = '',
      deskripsi = '',
      harga = '0', // awalnya string, akan kita parse
      nama_pengajar = '',
      tools = '[]',
      sesi = '[]',
      foto_pengajar_url = null
    } = req.body;

    const parsedHarga = parseInt(String(harga).replace(/\./g, ''), 10) || 0;

    const gambarKelas = req.files?.gambar_kelas?.[0]?.filename;
    if (!gambarKelas) {
      return res.status(400).json({ message: 'Gambar kelas wajib diupload' });
    }

    const [kelasResult] = await db.execute(
      `INSERT INTO kelas (judul, deskripsi, harga, nama_pengajar, image, foto_pengajar) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        judul,
        deskripsi,
        parsedHarga,
        nama_pengajar,
        gambarKelas,
        foto_pengajar_url
      ]
    );

    const kelasId = kelasResult.insertId;
    const toolsArray = JSON.parse(tools);
    const sesiArray = JSON.parse(sesi);

    for (let i = 0; i < toolsArray.length; i++) {
      const t = toolsArray[i];
      const imgField = `tools_image_${i}`;
      const image = req.files?.[imgField]?.[0]?.filename;
      if (!image) {
        return res.status(400).json({ message: `Gambar untuk tool ke-${i + 1} wajib diupload` });
      }

      await db.execute(
        `INSERT INTO tools (id_kelas, judul, deskripsi, image) VALUES (?, ?, ?, ?)`,
        [kelasId, t.judul, t.deskripsi, image]
      );
    }

    for (let i = 0; i < sesiArray.length; i++) {
      const s = sesiArray[i] || {};
      const videoField = `sesi_video_${i}`;
      const video = req.files?.[videoField]?.[0]?.filename || null;

      const judulSesi = s.judul || '';
      const topik = s.topik || '';

      const [sesiResult] = await db.execute(
        `INSERT INTO sesi (id_kelas, judul_sesi, topik, video) VALUES (?, ?, ?, ?)`,
        [kelasId, judulSesi, topik, video]  
      );

      const sesiId = sesiResult.insertId;

      // ✅ Tugas (jika ada)
      if (typeof s.tugas === 'string' && s.tugas.trim() !== '') {
        await db.execute(
          `INSERT INTO tugas (soal_tugas, id_sesi) VALUES (?, ?)`,
          [s.tugas.trim(), sesiId]
        );
      }

      // ✅ Quiz (jika ada dan lengkap)
      const quiz = s.quiz || {};
      if (
        typeof quiz.soal === 'string' &&
        quiz.soal.trim() !== '' &&
        Array.isArray(quiz.jawaban) &&
        quiz.jawaban.length === 4 &&
        typeof quiz.benar !== 'undefined'
      ) {
        const soal = quiz.soal.trim();
        const jawaban = quiz.jawaban.map(j => (typeof j === 'string' ? j : ''));
        const benar = Number(quiz.benar);

        // Simpan soal
        const [soalResult] = await db.execute(`INSERT INTO soal (soal) VALUES (?)`, [soal]);
        const id_soal = soalResult.insertId;

        // Simpan semua jawaban
        for (let j = 0; j < jawaban.length; j++) {
          const teks = jawaban[j] || '';
          const isBenar = j === benar ? 1 : 0;
          await db.execute(
            `INSERT INTO jawaban (jawaban, id_soal, benar) VALUES (?, ?, ?)`,
            [teks, id_soal, isBenar]
          );
        }

        // Simpan ke tabel quiz
        await db.execute(
          `INSERT INTO quiz (id_sesi, id_soal) VALUES (?, ?)`,
          [sesiId, id_soal]
        );
      }
    }

    res.status(201).json({ message: 'Kelas berhasil ditambahkan' });

  } catch (error) {
    console.error('Tambah kelas error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan kelas' });
  }
};

// Get Kelas by ID
exports.getKelasById = async (req, res) => {
  const { id } = req.params;

  try {
    const [kelas] = await db.query(`SELECT * FROM kelas WHERE id = ?`, [id]);
    if (kelas.length === 0) return res.status(404).json({ message: 'Kelas tidak ditemukan' });

    const dataKelas = kelas[0];
    const [mentor] = await db.query(
      `SELECT foto FROM users WHERE username = ? AND role = 'mentor'`,
      [dataKelas.nama_pengajar]
    );

    const foto_pengajar_url = mentor.length > 0
      ? `http://localhost:5000/uploads/${mentor[0].foto}`
      : null;

    const [tools] = await db.query(`SELECT * FROM tools WHERE id_kelas = ?`, [id]);
    const [sesiRows] = await db.query(`SELECT * FROM sesi WHERE id_kelas = ?`, [id]);

    const sesi = await Promise.all(
      sesiRows.map(async (s) => {
        const [tugasRows] = await db.query(`SELECT soal_tugas FROM tugas WHERE id_sesi = ?`, [s.id]);
        const [quizRows] = await db.query(
          `SELECT q.id_soal, soal.soal FROM quiz q JOIN soal ON q.id_soal = soal.id WHERE q.id_sesi = ?`,
          [s.id]
        );

        const quiz = await Promise.all(quizRows.map(async (q) => {
          const [jawabanRows] = await db.query(
            `SELECT jawaban, benar FROM jawaban WHERE id_soal = ?`,
            [q.id_soal]
          );

          return {
            soal: q.soal,
            jawaban: jawabanRows.map(j => ({ teks: j.jawaban, benar: j.benar === 1 }))
          };
        }));

        return {
          ...s,
          tugas: tugasRows.map(t => ({ soal_tugas: t.soal_tugas })),
          quiz
        };
      })
    );

    res.json({
      ...dataKelas,
      foto_pengajar: mentor[0]?.foto || null,
      foto_pengajar_url,
      tools,
      sesi
    });

  } catch (err) {
    console.error('Gagal mengambil detail kelas:', err);
    res.status(500).json({ message: 'Gagal mengambil detail kelas' });
  }
};

exports.updateKelas = async (req, res) => {
  const { id } = req.params;
  const {
    judul,
    deskripsi,
    harga,
    nama_pengajar,
    tools,
    sesi
  } = req.body;

  let toolsData = [], sesiData = [];

  try {
    toolsData = typeof tools === 'string' ? JSON.parse(tools) : tools || [];
    sesiData = typeof sesi === 'string' ? JSON.parse(sesi) : sesi || [];
  } catch (err) {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  const toolsImages = [];
  const sesiVideos = [];
  const sesiOldVideos = [];

  // Ambil file tools dan sesi berdasarkan nama dinamis
  for (let i = 0; i < 20; i++) {
    const toolFile = req.files[`tools_image_${i}`]?.[0];
    if (toolFile) toolsImages[i] = toolFile.filename;
  }

  for (let i = 0; i < 20; i++) {
    const sesiFile = req.files[`sesi_video_${i}`]?.[0];
    if (sesiFile) sesiVideos[i] = sesiFile.filename;
  }

  for (let i = 0; i < 20; i++) {
    const oldVideo = req.body[`old_sesi_video_${i}`];
    if (oldVideo) sesiOldVideos[i] = oldVideo;
  }

  try {
    // ✅ Update data utama kelas
    const [result] = await db.query(
      `UPDATE kelas SET judul = ?, deskripsi = ?, harga = ?, nama_pengajar = ? WHERE id = ?`,
      [judul, deskripsi, harga, nama_pengajar, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    // 🔁 Hapus tools lama
    await db.query(`DELETE FROM tools WHERE id_kelas = ?`, [id]);

    // ➕ Insert tools baru
    for (let i = 0; i < toolsData.length; i++) {
      const { judul, deskripsi } = toolsData[i];
      const image = toolsImages[i] || toolsData[i].image || 'belum.jpeg';
      await db.query(
        `INSERT INTO tools (id_kelas, judul, deskripsi, image) VALUES (?, ?, ?, ?)`,
        [id, judul, deskripsi, image]
      );
    }

    // 🔁 Hapus semua sesi & relasinya
    const [sesiLama] = await db.query(`SELECT id FROM sesi WHERE id_kelas = ?`, [id]);
    for (const sesi of sesiLama) {
      const id_sesi = sesi.id;
      const [quizList] = await db.query(`SELECT id_soal FROM quiz WHERE id_sesi = ?`, [id_sesi]);

      for (const q of quizList) {
        await db.query(`DELETE FROM jawaban WHERE id_soal = ?`, [q.id_soal]);
        await db.query(`DELETE FROM soal WHERE id = ?`, [q.id_soal]);
      }

      await db.query(`DELETE FROM tugas WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM quiz WHERE id_sesi = ?`, [id_sesi]);
    }
    await db.query(`DELETE FROM sesi WHERE id_kelas = ?`, [id]);

    // ➕ Tambahkan ulang semua sesi beserta relasinya
    for (let i = 0; i < sesiData.length; i++) {
      const s = sesiData[i];
      const video = sesiVideos[i] || sesiOldVideos[i];

      if (!video) {
        return res.status(400).json({ message: `Video sesi ke-${i + 1} wajib diupload` });
      }

      const [sesiResult] = await db.query(
        `INSERT INTO sesi (id_kelas, judul_sesi, topik, video) VALUES (?, ?, ?, ?)`,
        [id, s.judul, s.topik, video]
      );
      const id_sesi = sesiResult.insertId;

      // Tugas
      if (s.tugas && s.tugas.trim() !== '') {
        await db.query(
          `INSERT INTO tugas (soal_tugas, id_sesi, id_tugas_user) VALUES (?, ?, NULL)`,
          [s.tugas, id_sesi]
        );
      }

      // Quiz
      if (
        s.quiz &&
        s.quiz.soal &&
        Array.isArray(s.quiz.jawaban) &&
        s.quiz.jawaban.length === 4 &&
        typeof s.quiz.benar !== 'undefined'
      ) {
        const { soal, jawaban, benar } = s.quiz;
        const [soalResult] = await db.query(`INSERT INTO soal (soal) VALUES (?)`, [soal]);
        const id_soal = soalResult.insertId;

        for (let j = 0; j < jawaban.length; j++) {
          const teks = jawaban[j];
          const isBenar = j === Number(benar) ? 1 : 0;
          await db.query(
            `INSERT INTO jawaban (jawaban, id_soal, benar) VALUES (?, ?, ?)`,
            [teks, id_soal, isBenar]
          );
        }

        await db.query(`INSERT INTO quiz (id_sesi, id_soal) VALUES (?, ?)`, [id_sesi, id_soal]);
      }
    }

    res.status(200).json({ message: 'Kelas berhasil diperbarui' });

  } catch (err) {
    console.error('Gagal memperbarui kelas:', err);
    res.status(500).json({ message: 'Gagal memperbarui kelas' });
  }
};

// Delete Kelas
exports.deleteKelas = async (req, res) => {
  const { id } = req.params;

  try {
    const [sesiList] = await db.query(`SELECT id FROM sesi WHERE id_kelas = ?`, [id]);

    for (const sesi of sesiList) {
      const id_sesi = sesi.id;
      const [quizList] = await db.query(`SELECT id_soal FROM quiz WHERE id_sesi = ?`, [id_sesi]);

      for (const q of quizList) {
        await db.query(`DELETE FROM jawaban WHERE id_soal = ?`, [q.id_soal]);
        await db.query(`DELETE FROM soal WHERE id = ?`, [q.id_soal]);
      }

      await db.query(`DELETE FROM tugas WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM quiz WHERE id_sesi = ?`, [id_sesi]);
    }

    await db.query(`DELETE FROM sesi WHERE id_kelas = ?`, [id]);
    await db.query(`DELETE FROM tools WHERE id_kelas = ?`, [id]);
    const [result] = await db.query(`DELETE FROM kelas WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    res.json({ message: 'Kelas dan semua data terkait berhasil dihapus' });
  } catch (err) {
    console.error('Gagal menghapus kelas:', err);
    res.status(500).json({ message: 'Gagal menghapus kelas' });
  }
};
