const db = require('../db');
const fs = require('fs');

exports.getSummary = async (req, res) => {
  try {
    const [userRows] = await db.query("SELECT COUNT(*) user_count FROM users WHERE role = 'user'");
    const [kelasRows] = await db.query("SELECT COUNT(*) kelas_count FROM kelas");
 
    const userCount = userRows[0].user_count;
    const kelasCount = kelasRows[0].kelas_count;

    res.json({
      total_user: userCount, total_kelas: kelasCount
    });

  } catch (err) {
    console.error('Error getSummary:', err);
    res.status(500).json({ message: 'Gagal mengambil ringkasan dashboard' });
  }
};


exports.tambahAdmin = async (req, res) => {
  const { username, email, password, domisili, tanggal_lahir, alamat } = req.body;
  const foto = req.file ? req.file.filename : 'default-avatar.png';

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    await db.query(`
      INSERT INTO users (username, email, password, alamat, domisili, tanggal_lahir, foto, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'admin')
    `, [username, email, password, alamat, domisili, tanggal_lahir, foto]);

    res.status(201).json({ message: 'Admin berhasil ditambahkan.' });
  } catch (err) {
    console.error('Gagal tambah admin:', err);
    res.status(500).json({ message: 'Gagal menambahkan admin' });
  }
};

exports.getListAdmin = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM users WHERE role = 'admin' ORDER BY id ASC");
    res.json(result);
  } catch (err) {
    console.error('Gagal ambil list admin:', err);
    res.status(500).json({ message: 'Gagal mengambil data admin' });
  }
};

exports.getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM users WHERE id = ? AND role = 'admin'", [id]);
    if (result.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    res.json(result[0]);
  } catch (err) {
    console.error('Gagal ambil admin by ID:', err);
    res.status(500).json({ message: 'Gagal mengambil data admin' });
  }
};

exports.editAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, alamat, domisili, tanggal_lahir } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query('SELECT * FROM users WHERE id = ? AND role = "admin"', [id]);
    if (result.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const adminLama = result[0];

    const query = `
      UPDATE users 
      SET username = ?, email = ?, alamat = ?, domisili = ?, tanggal_lahir = ?${fotoBaru ? ', foto = ?' : ''}
      WHERE id = ? AND role = 'admin'
    `;

    const params = [username, email, alamat, domisili, tanggal_lahir];
    if (fotoBaru) params.push(fotoBaru);
    params.push(id);

    await db.query(query, params);

    if (fotoBaru && adminLama.foto !== 'default-avatar.png') {
      const pathFotoLama = `./uploads/${adminLama.foto}`;
      if (fs.existsSync(pathFotoLama)) fs.unlinkSync(pathFotoLama);
    }

    res.json({ message: 'Admin berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal edit admin:', err);
    res.status(500).json({ message: 'Gagal mengupdate admin' });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('SELECT foto FROM users WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const foto = result[0].foto;
    if (foto !== 'default-avatar.png') {
      const pathFoto = `./uploads/${foto}`;
      if (fs.existsSync(pathFoto)) fs.unlinkSync(pathFoto);
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Admin berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus admin:', err);
    res.status(500).json({ message: 'Gagal menghapus admin' });
  }
};
