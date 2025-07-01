const express = require('express');
const router = express.Router();
const { uploadKelasFields } = require('../middleware/upload'); // GUNAKAN YANG BARU

const {tambahKelas, getListKelas, getKelasById, updateKelas, deleteKelas,} = require('../controllers/kelasController');

router.get('/list-kelas', getListKelas);
router.post('/kelas', uploadKelasFields(), tambahKelas);
router.get('/kelas/:id', getKelasById);
router.put('/kelas/:id', uploadKelasFields(), updateKelas);
router.delete('/kelas/:id', deleteKelas);

module.exports = router;
