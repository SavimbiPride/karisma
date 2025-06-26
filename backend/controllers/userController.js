// controllers/userController.js
const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SECRET_KEY_KARISMA';

exports.getProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [decoded.id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
      res.json(results[0]);
    });
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

exports.updateProfile = (req, res) => {
  const { username, email, alamat, domisili, tanggal_lahir, id } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  console.log('Data yang diterima:', req.body);
  console.log('Foto yang diterima:', fotoBaru);

  // Siapkan query dan parameter secara dinamis
  let query = `
    UPDATE users SET 
      username = ?, 
      email = ?, 
      alamat = ?, 
      domisili = ?, 
      tanggal_lahir = ?`;
  const values = [username, email, alamat, domisili, tanggal_lahir];

  if (fotoBaru) {
    query += `, foto = ?`;
    values.push(fotoBaru);
  }

  query += ` WHERE id = ?`;
  values.push(id);

  // Eksekusi query
  db.query(query, values, (err) => {
    if (err) {
      console.error('Gagal update profil:', err);
      return res.status(500).json({ message: 'Gagal update profil' });
    }

    // Kirim respons sukses dengan data foto (jika ada)
    res.json({ 
      message: 'Profil diperbarui', 
      foto: fotoBaru 
    });
  });
};

exports.getAllUsers = (req, res) => {
  const query = 'SELECT id, username, email, alamat, domisili, tanggal_lahir, foto FROM users WHERE role = "user"';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error saat mengambil data user:', err);
      return res.status(500).json({ message: 'Gagal mengambil data user' });
    }
    res.json(result);
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ? AND role = "user"';

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus user' });
    res.json({ message: 'User berhasil dihapus' });
  });
};

