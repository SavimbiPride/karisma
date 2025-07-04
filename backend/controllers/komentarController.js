const db = require('../db');

// ambil
exports.getKomentarByKelas = async(req, res) => {
  const { id_kelas } = req.params;

  const query = `
    SELECT k.id, k.isi, k.dibuat, u.username, u.foto
    FROM komentar k
    JOIN users u ON k.id_user = u.id
    WHERE k.id_kelas = ?
    ORDER BY k.id DESC
  `;

  const [rows] = await db.query(query, [id_kelas]);

  res.json({rows});
};

// tambah
exports.postKomentar = async(req, res) => {
  const { id_kelas, isi } = req.body;
  const userId = req.user?.id;

  if (!id_kelas || !isi || !userId) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const insertQuery = `
    INSERT INTO komentar (id_kelas, id_user, isi)
    VALUES (?, ?, ?)
  `;

  db.query(insertQuery, [id_kelas, userId, isi], (err, result) => {
    if (err) {
      console.error('Gagal menambahkan komentar:', err);
      return res.status(500).json({ message: 'Gagal menambahkan komentar' });
    }

    const komentarId = result.insertId;

    const fetchQuery = `
      SELECT k.id, k.id_kelas, k.isi, k.dibuat, u.username, u.foto
      FROM komentar k
      JOIN users u ON k.id_user = u.id
      WHERE k.id = ?
    `;

    db.query(fetchQuery, [komentarId], (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error('Gagal ambil data komentar:', fetchErr);
        return res.status(500).json({ message: 'Komentar ditambahkan, tapi gagal ambil data lengkap' });
      }

      res.status(201).json(fetchResult[0]); // Kirim data komentar lengkap ke frontend
    });
  });
};
