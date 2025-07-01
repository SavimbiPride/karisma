const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  tambahKelas,
  getListKelas,
  getKelasById,
  updateKelas,
  deleteKelas,
} = require('../controllers/kelasController');

// Ambil semua kelas
router.get('/list-kelas', getListKelas);

// Tambah kelas (gunakan multer.fields karena banyak jenis file)
router.post(
  '/kelas',
  upload.fields([
    { name: 'foto_pengajar', maxCount: 1 },
    { name: 'gambar_kelas', maxCount: 1 },
    { name: 'tools_images', maxCount: 50 }, // boleh ditambah jika upload banyak tool
    { name: 'sesi_videos', maxCount: 50 },  // boleh ditambah jika banyak sesi
  ]),
  tambahKelas
);

// Ambil detail satu kelas by ID
router.get('/kelas/:id', getKelasById);

// Edit kelas — jika ingin pakai upload saat edit, gunakan upload.fields juga!
router.put(
  '/kelas/:id',
  upload.fields([
    { name: 'foto_pengajar', maxCount: 1 },
    { name: 'gambar_kelas', maxCount: 1 },
    { name: 'tools_images', maxCount: 50 },
    { name: 'sesi_videos', maxCount: 50 },
  ]),
  updateKelas
);

// Hapus kelas
router.delete('/kelas/:id', deleteKelas);

module.exports = router;
