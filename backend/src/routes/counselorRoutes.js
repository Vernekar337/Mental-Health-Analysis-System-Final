const express = require('express');
const router = express.Router();
const { getCases, decideCase } = require('../controllers/counselorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/cases', protect, authorize('Counselor', 'Admin'), getCases);
router.post('/cases/:id/decide', protect, authorize('Counselor'), decideCase);

module.exports = router;
