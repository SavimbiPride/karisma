const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder upload jika belum ada
const folder = './uploads';
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

// Ekstensi file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedVideoTypes = /mp4|webm|ogg/;

  const ext = path.extname(file.originalname).toLowerCase().substring(1);

  if (file.fieldname.includes('video')) {
    if (allowedVideoTypes.test(ext)) return cb(null, true);
  } else {
    if (allowedImageTypes.test(ext)) return cb(null, true);
  }

  cb(new Error(`File ${file.originalname} tidak didukung.`), false);
};

// Batasi ukuran file: 10MB (bisa diubah sesuai kebutuhan)
const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
