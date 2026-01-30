const Assessment = require('../models/Assessment');
const AnalysisResult = require('../models/AnalysisResult');
const CaseFile = require('../models/CaseFile');
const mlService = require('../services/mlService');

// @desc    Submit a new assessment and trigger ML analysis
// @route   POST /api/assessments
// @access  Private
const submitAssessment = async (req, res) => {
    try {
        const { assessmentType, rawResponses } = req.body;

        // 1. Save Assessment
        // Compute basic scores (this would arguably be done by checking the test type answer keys)
        // For this demo, we assume the frontend or a simple util provides computedScores or we leave it empty/mock 
        // if not strictly required to validate before ML.
        // We'll create a dummy 'computedScores' if not provided to satisfy Schema.
        const computedScores = req.body.computedScores || { total: 0 }; 
        
        // Basic severity logic (Mock)
        const severityLevel = 'Pending Analysis'; // Can be updated after ML or basic scoring

        const assessment = await Assessment.create({
            userId: req.user._id,
            assessmentType,
            rawResponses,
            computedScores,
            severityLevel
        });

        // 2. Call ML Service
        const mlResponse = await mlService.predictRisk({
            userId: req.user._id,
            assessmentId: assessment._id,
            responses: rawResponses,
            type: assessmentType
        });

        let analysisResult = null;

        if (mlResponse.success && mlResponse.data) {
            const { mhIndex, mhIndexBreakdown, predictedTrajectory, clusterLabel, anomalyDetected } = mlResponse.data;

            // 3. Create AnalysisResult
            analysisResult = await AnalysisResult.create({
                userId: req.user._id,
                mhIndex,
                mhIndexBreakdown,
                predictedTrajectory,
                clusterLabel,
                anomalyDetected
            });

            // 4. Check Risk Rules for CaseFile
            // Rules: MH_Index > Threshold (e.g., 0.7) OR Anomaly == true OR Trajectory == Increasing
            const RISK_THRESHOLD = 0.7; // Configurable
            const isHighRisk = mhIndex > RISK_THRESHOLD;
            const isWorsening = predictedTrajectory && predictedTrajectory.trend === 'Increasing';
            
            if (isHighRisk || anomalyDetected || isWorsening) {
                let triggerReason = '';
                if (isHighRisk) triggerReason += `High MH Index (${mhIndex}). `;
                if (anomalyDetected) triggerReason += 'Anomaly Detected. ';
                if (isWorsening) triggerReason += 'Predicted Worsening Trajectory. ';

                // Check if a pending case already exists to avoid duplicates? 
                // Requirement says "Backend creates CaseFile ONLY when...". 
                // We'll check for an open case to be polite, or just create a new one.
                const pendingCase = await CaseFile.findOne({ userId: req.user._id, status: 'Pending' });
                
                if (!pendingCase) {
                    await CaseFile.create({
                        userId: req.user._id,
                        triggerReason: triggerReason.trim(),
                        status: 'Pending'
                    });
                    console.log(`[Risk Alert] CaseFile created for user ${req.user._id}`);
                }
            }
        } else {
            console.warn(`[ML Service] Failed to analyze assessment for user ${req.user._id}. Reason: ${mlResponse.error}`);
            // We do NOT create a CaseFile on failure.
        }

        res.status(201).json({
            message: 'Assessment submitted successfully',
            assessment,
            analysis: analysisResult
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing assessment' });
    }
};

// @desc    Get user's assessment history
// @route   GET /api/assessments/history
// @access  Private
const getAssessmentHistory = async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(assessments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    submitAssessment,
    getAssessmentHistory
};
