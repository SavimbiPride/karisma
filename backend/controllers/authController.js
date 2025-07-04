const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MELODIE';

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, 'user']
    );

    res.status(201).json({ message: 'User berhasil didaftarkan' });
  } catch (err) {
    console.error('Error register:', err);
    res.status(500).json({ message: 'Gagal mendaftarkan user' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi.' });
  }

  try {
    const [results] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = results[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token,
      id: user.id,
      username: user.username,
      role: user.role,
      foto: user.foto || 'default-avatar.png'
    });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ message: 'Gagal login' });
  }
};
