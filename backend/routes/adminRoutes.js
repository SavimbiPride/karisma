const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadsingle');
const adminController = require('../controllers/adminController');

router.get('/summary', adminController.getSummary);
router.post('/admin', upload.single('foto'), adminController.tambahAdmin);
router.get('/list-admin', adminController.getListAdmin);
router.get('/admin/:id', adminController.getAdminById);
router.put('/admin/:id', upload.single('foto'), adminController.editAdmin);
router.delete('/admin/:id', adminController.deleteAdmin);

module.exports = router;
