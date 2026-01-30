const express = require('express');
const router = express.Router();
const { 
    proxyPredict, 
    proxyCluster, 
    proxyAnomaly,
    proxyText,
    proxyAudio
} = require('../controllers/internalMlController');

// Access to these should also be protected, or restricted to internal services/admins/authenticated users.
// The prompt didn't specify strict auth on these, but "Backend acts as an API Gateway" implies these are used by the frontend *via* the backend?
// Wait, the prompt lists these under "ML PROXY (INTERNAL)".
// If they are internal, only other services might call them, OR the frontend uses them for debugging?
// Usually, "Proxy" means frontend calls Backend -> Backend calls ML.
// So these are endpoints EXPOSED to the frontend.
// I will apply 'protect' to ensure only authenticated users can trigger ML via proxy if that's the use case.
const { protect } = require('../middleware/authMiddleware');

router.post('/predict', protect, proxyPredict);
router.post('/cluster', protect, proxyCluster);
router.post('/anomaly', protect, proxyAnomaly);
router.post('/text', protect, proxyText);
router.post('/audio', protect, proxyAudio);

module.exports = router;
