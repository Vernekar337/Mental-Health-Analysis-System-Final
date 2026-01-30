const express = require('express');
const router = express.Router();
const { getSystemOverview } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/overview', protect, authorize('Admin'), getSystemOverview);

module.exports = router;
