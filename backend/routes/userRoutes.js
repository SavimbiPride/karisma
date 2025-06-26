// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { deleteUser } = require('../controllers/userController');
const { getProfile, updateProfile } = userController;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, `profile_${unique}`);
  },
});

const upload = multer({ storage });

router.get('/me', getProfile);
router.post('/update-profile', upload.single('foto'), updateProfile);
router.get('/list-user', userController.getAllUsers);
router.delete('/user/:id', deleteUser);

module.exports = router;
