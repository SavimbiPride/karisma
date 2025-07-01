const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folder = './uploads';
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);

  if (allowedImageTypes.test(ext)) return cb(null, true);
  cb(new Error(`File ${file.originalname} tidak didukung.`), false);
};

// ukuran mb
const limits = {
  fileSize: 10 * 1024 * 1024,
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

const uploadAdmin = multer({ storage, fileFilter, limits });

module.exports = uploadAdmin;
