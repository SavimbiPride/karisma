const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadSingle = require('../middleware/uploadsingle');

const { getProfile, updateProfile, getAllUsers, deleteUser } = userController;

router.get('/me', getProfile);
router.post('/update-profile', uploadSingle.single('foto'), updateProfile);
router.get('/list-user', getAllUsers);
router.delete('/user/:id', deleteUser);

module.exports = router;
