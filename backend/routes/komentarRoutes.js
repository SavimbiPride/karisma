const express = require('express');
const router = express.Router();
const {getKomentarByKelas, postKomentar} = require('../controllers/KomentarController');
const verifyToken = require('../middleware/verifyToken');

// ambil
router.get('/komentar/:id_kelas', getKomentarByKelas);

// aambah
router.post('/komentar', verifyToken, postKomentar);

module.exports = router;
