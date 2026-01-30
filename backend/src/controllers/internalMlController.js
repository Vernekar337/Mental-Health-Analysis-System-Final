const mlService = require('../services/mlService');

// @desc    Proxy to /predict
// @route   POST /api/internal/ml/predict
const proxyPredict = async (req, res) => {
    const result = await mlService.predictRisk(req.body);
    res.status(result.success ? 200 : 500).json(result);
};

// @desc    Proxy to /cluster
// @route   POST /api/internal/ml/cluster
const proxyCluster = async (req, res) => {
    const result = await mlService.clusterUsers(req.body);
    res.status(result.success ? 200 : 500).json(result);
};

// @desc    Proxy to /anomaly
// @route   POST /api/internal/ml/anomaly
const proxyAnomaly = async (req, res) => {
    const result = await mlService.detectAnomaly(req.body);
    res.status(result.success ? 200 : 500).json(result);
};

// @desc    Proxy to /text
// @route   POST /api/internal/ml/text
const proxyText = async (req, res) => {
    const result = await mlService.processText(req.body.text);
    res.status(result.success ? 200 : 500).json(result);
};

// @desc    Proxy to /audio
// @route   POST /api/internal/ml/audio
const proxyAudio = async (req, res) => {
    // For internal proxy, we might assume JSON metadata or direct handling
    // This endpoint wraps the service call
    const result = await mlService.processAudio(req.body);
    res.status(result.success ? 200 : 500).json(result);
};

module.exports = {
    proxyPredict,
    proxyCluster,
    proxyAnomaly,
    proxyText,
    proxyAudio
};
