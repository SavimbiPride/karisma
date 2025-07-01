// db.js
const mysql = require('mysql2');

// Buat pool koneksi
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'norio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tes koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
  } else {
    console.log('Terhubung ke database MySQL');
    connection.release(); // Jangan lupa lepas koneksi kembali ke pool
  }
});

// Ekspor versi promise dari pool
module.exports = pool.promise();
