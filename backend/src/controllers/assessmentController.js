const Assessment = require('../models/Assessment');
const AnalysisResult = require('../models/AnalysisResult');
const CaseFile = require('../models/CaseFile');
const mlService = require('../services/mlService');
const asyncHandler = require('../middleware/asyncHandler');
const { validateRequest, validateEnum } = require('../utils/validationUtil');

// @desc    Submit a new assessment and trigger ML analysis
// @route   POST /api/assessments
// @access  Private
const submitAssessment = asyncHandler(async (req, res) => {
    validateRequest(req, ['assessmentType', 'rawResponses']);
    
    // Validate assessment type enum (Assuming types, adjust as per model definition if needed)
    // validateEnum(req.body.assessmentType, ['GAD-7', 'PHQ-9', 'General'], 'Assessment Type');

    const { assessmentType, rawResponses } = req.body;
    const userId = req.user._id;

    // 1. Transaction-like sequence start
    // Save Assessment Initial State
    const computedScores = req.body.computedScores || { total: 0 }; 
    const severityLevel = 'Pending Analysis';

    const assessment = await Assessment.create({
        userId,
        assessmentType,
        rawResponses,
        computedScores,
        severityLevel
    });

    try {
        // 2. Call ML Service
        const mlResponse = await mlService.predictRisk({
            userId,
            assessmentId: assessment._id,
            responses: rawResponses,
            type: assessmentType
        });

        if (!mlResponse.success || !mlResponse.data) {
            // ML Failed or returned invalid data
            // We return success for assessment creation, but warn about analysis failure
            return res.status(201).json({
                success: true,
                message: 'Assessment saved, but analysis unavailable at this time.',
                assessment,
                analysis: null
            });
        }

        const { mhIndex, mhIndexBreakdown, predictedTrajectory, clusterLabel, anomalyDetected } = mlResponse.data;

        // 3. Create AnalysisResult
        const analysisResult = await AnalysisResult.create({
            userId,
            mhIndex,
            mhIndexBreakdown,
            predictedTrajectory,
            clusterLabel,
            anomalyDetected
        });

        // 4. Check Risk Rules for CaseFile
        const RISK_THRESHOLD = parseFloat(process.env.MH_RISK_THRESHOLD) || 0.7;
        const isHighRisk = mhIndex > RISK_THRESHOLD;
        const isWorsening = predictedTrajectory && predictedTrajectory.trend === 'Increasing';
        
        if (isHighRisk || anomalyDetected || isWorsening) {
            // Check for existing pending case to prevent duplicates
            const existingCase = await CaseFile.findOne({ userId, status: 'Pending' });

            if (!existingCase) {
                let triggerReason = '';
                if (isHighRisk) triggerReason += `High MH Index (${mhIndex}). `;
                if (anomalyDetected) triggerReason += 'Anomaly Detected. ';
                if (isWorsening) triggerReason += 'Predicted Worsening Trajectory. ';

                await CaseFile.create({
                    userId,
                    triggerReason: triggerReason.trim(),
                    status: 'Pending'
                });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Assessment submitted and analyzed successfully',
            assessment,
            analysis: analysisResult
        });

    } catch (error) {
        // If ML analysis or subsequent steps fail, we still have the Assessment saved.
        // We log the error but don't fail the request completely if possible, 
        // OR we can choose to bubble it up. Given the requirements, we must return consistent response.
        console.error('Analysis flow failed:', error);
        
        // Return 201 with warning if assessment was saved but analysis failed
        if (assessment) {
             return res.status(201).json({
                success: true,
                message: 'Assessment saved, but analysis failed due to server error.',
                assessment,
                analysis: null
            });
        }
        throw error; // If assessment wasn't even saved
    }
});

// @desc    Get user's assessment history
// @route   GET /api/assessments/history
// @access  Private
const getAssessmentHistory = asyncHandler(async (req, res) => {
    const assessments = await Assessment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
        success: true,
        count: assessments.length,
        data: assessments
    });
});

module.exports = {
    submitAssessment,
    getAssessmentHistory
};
