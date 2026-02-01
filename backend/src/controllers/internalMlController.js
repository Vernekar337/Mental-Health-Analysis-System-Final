const mlService = require('../services/mlService');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to normalize ML response for internal API
const sendMlResponse = (res, result) => {
    if (result.success) {
        res.json({ success: true, data: result.data });
    } else {
        // Return 503 or 422 depending on error type, for now 503 Service Unavailable is appropriate for ML down/timeout
        res.status(503).json({ 
            success: false, 
            message: 'ML Service Unavailable or Returned Error', 
            details: result.error,
            errorCode: 'ML_SERVICE_ERROR'
        });
    }
};

// @desc    Proxy to /predict
// @route   POST /api/internal/ml/predict
const proxyPredict = asyncHandler(async (req, res) => {
    const result = await mlService.predictRisk(req.body);
    sendMlResponse(res, result);
});

// @desc    Proxy to /cluster
// @route   POST /api/internal/ml/cluster
const proxyCluster = asyncHandler(async (req, res) => {
    const result = await mlService.clusterUsers(req.body);
    sendMlResponse(res, result);
});

// @desc    Proxy to /anomaly
// @route   POST /api/internal/ml/anomaly
const proxyAnomaly = asyncHandler(async (req, res) => {
    const result = await mlService.detectAnomaly(req.body);
    sendMlResponse(res, result);
});

// @desc    Proxy to /text
// @route   POST /api/internal/ml/text
const proxyText = asyncHandler(async (req, res) => {
    const result = await mlService.processText(req.body.text);
    sendMlResponse(res, result);
});

// @desc    Proxy to /audio
// @route   POST /api/internal/ml/audio
const proxyAudio = asyncHandler(async (req, res) => {
    // This endpoint wraps the service call
    const result = await mlService.processAudio(req.body); // req.body might need adjustment if service expects stream here
    sendMlResponse(res, result);
});

module.exports = {
    proxyPredict,
    proxyCluster,
    proxyAnomaly,
    proxyText,
    proxyAudio
};
