const db = require('../db');
const fs = require('fs');


exports.getListMentor = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT id, username, email, alamat, domisili, tanggal_lahir, foto FROM users WHERE role = 'mentor' ORDER BY id ASC"
    );
    res.json(result);
  } catch (err) {
    console.error('Gagal ambil list mentor:', err);
    res.status(500).json({ message: 'Gagal mengambil data mentor' });
  }
};

exports.getMentorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "SELECT id, username, email, alamat, domisili, tanggal_lahir, foto FROM users WHERE id = ? AND role = 'mentor'",
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Mentor tidak ditemukan' });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('Gagal ambil mentor by ID:', err);
    res.status(500).json({ message: 'Gagal mengambil data mentor' });
  }
};

exports.tambahMentor = async (req, res) => {
  const { username, email, password, domisili, tanggal_lahir, alamat } = req.body;
  const foto = req.file ? req.file.filename : 'default-avatar.png';

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    await db.query(
      `
      INSERT INTO users (username, email, password, alamat, domisili, tanggal_lahir, foto, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'mentor')
    `,
      [username, email, password, alamat, domisili, tanggal_lahir, foto]
    );

    res.status(201).json({ message: 'Mentor berhasil ditambahkan.' });
  } catch (err) {
    console.error('Gagal tambah mentor:', err);
    res.status(500).json({ message: 'Gagal menambahkan mentor' });
  }
};

exports.updateMentor = async (req, res) => {
  const { id } = req.params;
  const { username, email, alamat, domisili, tanggal_lahir } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = "mentor"',
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Mentor tidak ditemukan' });
    }

    const mentorLama = result[0];

    const query = `
      UPDATE users 
      SET username = ?, email = ?, alamat = ?, domisili = ?, tanggal_lahir = ?${fotoBaru ? ', foto = ?' : ''}
      WHERE id = ? AND role = 'mentor'
    `;

    const params = [username, email, alamat, domisili, tanggal_lahir];
    if (fotoBaru) params.push(fotoBaru);
    params.push(id);

    await db.query(query, params);

    // Hapus foto lama jika ada foto baru & bukan default
    if (fotoBaru && mentorLama.foto && mentorLama.foto !== 'default-avatar.png') {
      const pathFotoLama = `./uploads/${mentorLama.foto}`;
      if (fs.existsSync(pathFotoLama)) {
        fs.unlinkSync(pathFotoLama);
      }
    }

    res.json({ message: 'Mentor berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal edit mentor:', err);
    res.status(500).json({ message: 'Gagal mengupdate mentor' });
  }
};

exports.deleteMentor = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'SELECT foto FROM users WHERE id = ? AND role = "mentor"',
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Mentor tidak ditemukan' });
    }

    const foto = result[0].foto;
    if (foto && foto !== 'default-avatar.png') {
      const pathFoto = `./uploads/${foto}`;
      if (fs.existsSync(pathFoto)) {
        fs.unlinkSync(pathFoto);
      }
    }

    await db.query('DELETE FROM users WHERE id = ? AND role = "mentor"', [id]);
    res.json({ message: 'Mentor berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus mentor:', err);
    res.status(500).json({ message: 'Gagal menghapus mentor' });
  }
};