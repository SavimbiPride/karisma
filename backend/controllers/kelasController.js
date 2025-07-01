const db = require('../db');

// Ambil semua kelas
exports.getListKelas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM kelas');
    res.json(results);
  } catch (err) {
    console.error('Gagal mengambil data kelas:', err);
    res.status(500).json({ message: 'Gagal mengambil data kelas' });
  }
};

// Tambah kelas lengkap
exports.tambahKelas = async (req, res) => {
  const { judul, deskripsi, harga, nama_pengajar, tools, sesi } = req.body;

  let toolsData = [], sesiData = [];

  try {
    toolsData = JSON.parse(tools);
    sesiData = JSON.parse(sesi);
  } catch (err) {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  const fotoPengajar = req.files['foto_pengajar']?.[0]?.filename || null;
  const gambarKelas = req.files['gambar_kelas']?.[0]?.filename || null;

  if (!gambarKelas) {
    return res.status(400).json({ message: 'Gambar kelas wajib diunggah.' });
  }

  const toolsImages = req.files['tools_images'] || [];
  const sesiVideos = req.files['sesi_videos'] || [];

  try {
    const [kelasResult] = await db.query(
      `INSERT INTO kelas (judul, deskripsi, harga, nama_pengajar, foto_pengajar, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [judul, deskripsi, harga, nama_pengajar, fotoPengajar, gambarKelas]
    );
    const id_kelas = kelasResult.insertId;

    for (let i = 0; i < toolsData.length; i++) {
      const { judul, deskripsi } = toolsData[i];
      const imageTool = toolsImages[i]?.filename || null;

      await db.query(
        `INSERT INTO tools (id_kelas, judul, deskripsi, image) VALUES (?, ?, ?, ?)`,
        [id_kelas, judul, deskripsi, imageTool]
      );
    }

    for (let i = 0; i < sesiData.length; i++) {
      const s = sesiData[i];
      const videoFile = sesiVideos[i]?.filename || null;

      const [sesiResult] = await db.query(
        `INSERT INTO sesi (id_kelas, judul_sesi, topik) VALUES (?, ?, ?)`,
        [id_kelas, s.judul, s.topik]
      );
      const id_sesi = sesiResult.insertId;

      if (videoFile) {
        await db.query(`INSERT INTO empe4 (video, id_sesi) VALUES (?, ?)`, [videoFile, id_sesi]);
      }

      if (s.tugas) {
        await db.query(
          `INSERT INTO tugas (id_sesi, soal_tugas, id_tugas_user) VALUES (?, ?, NULL)`,
          [id_sesi, s.tugas]
        );
      }

      if (
        s.quiz &&
        s.quiz.soal &&
        Array.isArray(s.quiz.jawaban) &&
        s.quiz.jawaban.length === 4 &&
        typeof s.quiz.benar === 'number'
      ) {
        const { soal, jawaban, benar: indexBenar } = s.quiz;

        const [soalResult] = await db.query(`INSERT INTO soal (soal) VALUES (?)`, [soal]);
        const id_soal = soalResult.insertId;

        for (let j = 0; j < jawaban.length; j++) {
          const isBenar = j === indexBenar ? 1 : 0;
          await db.query(
            `INSERT INTO jawaban (jawaban, id_soal, benar) VALUES (?, ?, ?)`,
            [jawaban[j], id_soal, isBenar]
          );
        }

        await db.query(`INSERT INTO quiz (id_sesi, id_soal) VALUES (?, ?)`, [id_sesi, id_soal]);
      }
    }

    res.status(200).json({ message: 'Kelas berhasil ditambahkan' });
  } catch (error) {
    console.error('Gagal menambah kelas:', error);
    res.status(500).json({ message: 'Gagal menambah kelas', error });
  }
};

// Update kelas lengkap (termasuk tools dan sesi)
exports.updateKelas = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, harga, nama_pengajar, tools, sesi } = req.body;

  let toolsData = [], sesiData = [];

  try {
    toolsData = JSON.parse(tools);
    sesiData = JSON.parse(sesi);
  } catch (err) {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  try {
    // Update data kelas utama
    const [result] = await db.query(
      `UPDATE kelas SET judul = ?, deskripsi = ?, harga = ?, nama_pengajar = ? WHERE id = ?`,
      [judul, deskripsi, harga, nama_pengajar, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    // tools lama
    await db.query(`DELETE FROM tools WHERE id_kelas = ?`, [id]);

    // tools baru
    for (let i = 0; i < toolsData.length; i++) {
      const { judul, deskripsi, image } = toolsData[i];
      await db.query(
        `INSERT INTO tools (id_kelas, judul, deskripsi, image) VALUES (?, ?, ?, ?)`,
        [id, judul, deskripsi, image || null]
      );
    }

    // sesi lama lalu hapus turunannya
    const [sesiList] = await db.query(`SELECT id FROM sesi WHERE id_kelas = ?`, [id]);

    for (const sesi of sesiList) {
      const id_sesi = sesi.id;

      const [quizList] = await db.query(`SELECT id_soal FROM quiz WHERE id_sesi = ?`, [id_sesi]);
      for (const q of quizList) {
        await db.query(`DELETE FROM jawaban WHERE id_soal = ?`, [q.id_soal]);
        await db.query(`DELETE FROM soal WHERE id = ?`, [q.id_soal]);
      }

      await db.query(`DELETE FROM empe4 WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM tugas WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM quiz WHERE id_sesi = ?`, [id_sesi]);
    }

    // sesi 
    await db.query(`DELETE FROM sesi WHERE id_kelas = ?`, [id]);

    // Insert sesi baru beserta anak-anaknya
    for (let i = 0; i < sesiData.length; i++) {
      const s = sesiData[i];

      const [sesiResult] = await db.query(
        `INSERT INTO sesi (id_kelas, judul_sesi, topik) VALUES (?, ?, ?)`,
        [id, s.judul, s.topik]
      );
      const id_sesi = sesiResult.insertId;

      if (s.video) {
        await db.query(`INSERT INTO empe4 (video, id_sesi) VALUES (?, ?)`, [s.video, id_sesi]);
      }

      if (s.tugas) {
        await db.query(
          `INSERT INTO tugas (id_sesi, soal_tugas, id_tugas_user) VALUES (?, ?, NULL)`,
          [id_sesi, s.tugas]
        );
      }

      if (
        s.quiz &&
        s.quiz.soal &&
        Array.isArray(s.quiz.jawaban) &&
        s.quiz.jawaban.length === 4 &&
        typeof s.quiz.benar === 'number'
      ) {
        const { soal, jawaban, benar: indexBenar } = s.quiz;

        const [soalResult] = await db.query(`INSERT INTO soal (soal) VALUES (?)`, [soal]);
        const id_soal = soalResult.insertId;

        for (let j = 0; j < jawaban.length; j++) {
          const isBenar = j === indexBenar ? 1 : 0;
          await db.query(
            `INSERT INTO jawaban (jawaban, id_soal, benar) VALUES (?, ?, ?)`,
            [jawaban[j], id_soal, isBenar]
          );
        }

        await db.query(`INSERT INTO quiz (id_sesi, id_soal) VALUES (?, ?)`, [id_sesi, id_soal]);
      }
    }

    res.json({ message: 'Kelas dan semua data terkait berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal memperbarui kelas:', err);
    res.status(500).json({ message: 'Gagal memperbarui kelas' });
  }
};

// Ambil detail kelas by ID
exports.getKelasById = async (req, res) => {
  const { id } = req.params;

  try {
    const [kelas] = await db.query(`SELECT * FROM kelas WHERE id = ?`, [id]);
    if (kelas.length === 0) return res.status(404).json({ message: 'Kelas tidak ditemukan' });

    const [tools] = await db.query(`SELECT * FROM tools WHERE id_kelas = ?`, [id]);
    const [sesiRows] = await db.query(`SELECT * FROM sesi WHERE id_kelas = ?`, [id]);

    const sesi = await Promise.all(
      sesiRows.map(async (s) => {
        const [videoRows] = await db.query(`SELECT video FROM empe4 WHERE id_sesi = ?`, [s.id]);
        const [tugasRows] = await db.query(`SELECT soal_tugas FROM tugas WHERE id_sesi = ?`, [s.id]);

        const [quizRows] = await db.query(
          `SELECT q.id_soal, soal.soal FROM quiz q JOIN soal ON q.id_soal = soal.id WHERE q.id_sesi = ?`,
          [s.id]
        );

        const quiz = await Promise.all(
          quizRows.map(async (q) => {
            const [jawabanRows] = await db.query(
              `SELECT jawaban, benar FROM jawaban WHERE id_soal = ?`,
              [q.id_soal]
            );

            return {
              soal: q.soal,
              jawaban: jawabanRows.map(j => ({ teks: j.jawaban, benar: j.benar === 1 }))
            };
          })
        );

        return {
          ...s,
          video: videoRows.map(v => v.video),
          tugas: tugasRows.map(t => ({ soal_tugas: t.soal_tugas })),
          quiz
        };
      })
    );

    res.json({ ...kelas[0], tools, sesi });
  } catch (err) {
    console.error('Gagal mengambil detail kelas:', err);
    res.status(500).json({ message: 'Gagal mengambil detail kelas' });
  }
};

// Hapus kelas
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

      await db.query(`DELETE FROM quiz WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM empe4 WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM tugas WHERE id_sesi = ?`, [id_sesi]);
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
