const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const folder = './uploads';
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

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

// ukuran mb
const limits = {
  fileSize: 10 * 1024 * 1024,
};

// Storage
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

const uploadKelasFields = () => {
  const fields = [];
  
  for (let i = 0; i < 20; i++) {
    fields.push({ name: `tools_image_${i}`, maxCount: 1 });
    fields.push({ name: `sesi_video_${i}`, maxCount: 1 });
  }
  fields.push({ name: 'foto_pengajar', maxCount: 1 });
  fields.push({ name: 'gambar_kelas', maxCount: 1 });

  return upload.fields(fields);
};

module.exports = {
  upload,
  uploadKelasFields,
};
