// controllers/authController.js
const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SECRET_KEY_KARISMA';

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length > 0) return res.status(409).json({ message: 'Email sudah terdaftar' });

    const insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [username, email, password, 'user'], (err) => {
      if (err) return res.status(500).json({ message: 'Gagal mendaftarkan user' });
      res.status(201).json({ message: 'User berhasil didaftarkan' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Email atau password salah' });

    const user = results[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY
    );

    res.json({
      token,
      username: user.username,
      role: user.role,
      foto: user.foto || 'default-avatar.png'
    });
  });
};


