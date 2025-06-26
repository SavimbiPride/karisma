const db = require('../db');
const fs = require('fs');

// Ringkasan Dashboard
exports.getSummary = (req, res) => {
  const totalUserQuery = "SELECT COUNT(*) AS total_user FROM users WHERE role = 'user'";
  const totalKelasQuery = "SELECT COUNT(*) AS total_kelas FROM kelas";

  db.query(totalUserQuery, (err1, userResult) => {
    if (err1) return res.status(500).json({ message: 'Error mengambil user' });

    db.query(totalKelasQuery, (err2, kelasResult) => {
      if (err2) return res.status(500).json({ message: 'Error mengambil kelas' });

      res.json({
        total_user: userResult[0].total_user,
        total_kelas: kelasResult[0].total_kelas,
      });
    });
  });
};

// Tambah Admin
exports.tambahAdmin = (req, res) => {
  const { username, email, password, domisili, tanggal_lahir, alamat } = req.body;
  const foto = req.file ? req.file.filename : 'default-avatar.png';

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  const cekEmail = 'SELECT * FROM users WHERE email = ?';
  db.query(cekEmail, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal cek email' });
    if (result.length > 0) return res.status(400).json({ message: 'Email sudah digunakan' });

    const tambahAdmin = `
      INSERT INTO users (username, email, password, alamat, domisili, tanggal_lahir, foto, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'admin')
    `;
    db.query(
      tambahAdmin,
      [username, email, password, alamat, domisili, tanggal_lahir, foto],
      (err2) => {
        if (err2) return res.status(500).json({ message: 'Gagal menambahkan admin' });
        res.status(201).json({ message: 'Admin berhasil ditambahkan.' });
      }
    );
  });
};

// Get List Admin
exports.getListAdmin = (req, res) => {
  db.query("SELECT * FROM users WHERE role = 'admin' ORDER BY id ASC", (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data admin' });
    res.json(result);
  });
};

// Get Admin by ID
exports.getAdminById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ? AND role = 'admin'", [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data admin' });
    if (result.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    res.json(result[0]);
  });
};

// Edit Admin
exports.editAdmin = (req, res) => {
  const { id } = req.params;
  const { username, email, alamat, domisili, tanggal_lahir } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  db.query('SELECT * FROM users WHERE id = ? AND role = "admin"', [id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    const adminLama = result[0];
    const query = `
      UPDATE users 
      SET username = ?, email = ?, alamat = ?, domisili = ?, tanggal_lahir = ?${fotoBaru ? ', foto = ?' : ''}
      WHERE id = ? AND role = 'admin'
    `;
    const params = [username, email, alamat, domisili, tanggal_lahir];
    if (fotoBaru) params.push(fotoBaru);
    params.push(id);

    db.query(query, params, (err2) => {
      if (err2) return res.status(500).json({ message: 'Gagal mengupdate admin' });

      if (fotoBaru && adminLama.foto !== 'default-avatar.png') {
        const pathFotoLama = `./uploads/${adminLama.foto}`;
        if (fs.existsSync(pathFotoLama)) fs.unlinkSync(pathFotoLama);
      }

      res.json({ message: 'Admin berhasil diperbarui' });
    });
  });
};

// Delete Admin
exports.deleteAdmin = (req, res) => {
  const { id } = req.params;

  db.query('SELECT foto FROM users WHERE id = ?', [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ message: 'Admin tidak ditemukan' });

    const foto = result[0].foto;
    if (foto !== 'default-avatar.png') {
      const pathFoto = `./uploads/${foto}`;
      if (fs.existsSync(pathFoto)) fs.unlinkSync(pathFoto);
    }

    db.query('DELETE FROM users WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Gagal menghapus admin' });
      res.json({ message: 'Admin berhasil dihapus' });
    });
  });
};
