const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { processTextEntry, processAudioEntry } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimitMiddleware');

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './'); // Save to root or a specific folder. 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ dest: 'uploads/' }); 

router.post('/text', protect, apiLimiter, processTextEntry);
router.post('/audio', protect, apiLimiter, upload.single('audioFile'), processAudioEntry);

module.exports = router;
