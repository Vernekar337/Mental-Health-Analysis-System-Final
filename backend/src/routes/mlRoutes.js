const express = require('express');
const router = express.Router();
const { 
    proxyPredict, 
    proxyCluster, 
    proxyAnomaly,
    proxyText,
    proxyAudio
} = require('../controllers/internalMlController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { internalLimiter } = require('../middleware/rateLimitMiddleware');

// LOCKED DOWN: Protected + Admin Only + Rate Limited
router.post('/predict', protect, authorize('Admin'), internalLimiter, proxyPredict);
router.post('/cluster', protect, authorize('Admin'), internalLimiter, proxyCluster);
router.post('/anomaly', protect, authorize('Admin'), internalLimiter, proxyAnomaly);
router.post('/text', protect, authorize('Admin'), internalLimiter, proxyText);
router.post('/audio', protect, authorize('Admin'), internalLimiter, proxyAudio);

module.exports = router;
