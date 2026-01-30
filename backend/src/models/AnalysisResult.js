const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mhIndex: {
        type: Number,
        required: true
    },
    // Breakdown of the index (e.g., anxiety: 0.5, depression: 0.2)
    mhIndexBreakdown: {
        type: Map,
        of: Number
    },
    predictedTrajectory: {
        trend: {
            type: String, // 'Increasing', 'Decreasing', 'Stable'
            default: 'Stable'
        },
        confidence: Number
    },
    clusterLabel: {
        type: String
    },
    anomalyDetected: {
        type: Boolean,
        default: false
    }
}, {
    // GeneratedAt is handled by timestamps: true (createdAt)
    timestamps: { createdAt: 'generatedAt', updatedAt: false }
});

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
