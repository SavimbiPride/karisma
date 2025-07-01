const express = require('express'); 
const router = express.Router();
const upload = require('../middleware/uploadsingle');

const { getListMentor, getMentorById, tambahMentor, updateMentor, deleteMentor,} = require('../controllers/mentorController');

router.get('/list-mentor', getListMentor);
router.get('/mentor/:id', getMentorById);
router.post('/mentor', upload.single('foto'), tambahMentor);
router.put('/mentor/:id', upload.single('foto'), updateMentor);
router.delete('/mentor/:id', deleteMentor);

module.exports = router;
