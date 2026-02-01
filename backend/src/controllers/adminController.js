const User = require('../models/User');
const CaseFile = require('../models/CaseFile');
const Assessment = require('../models/Assessment');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get system overview stats
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getSystemOverview = asyncHandler(async (req, res) => {
    // Parallelize count queries for performance
    const [totalUsers, pendingCases, totalAssessments] = await Promise.all([
        User.countDocuments(),
        CaseFile.countDocuments({ status: 'Pending' }),
        Assessment.countDocuments()
    ]);

    // Aggregate breakdown of assessment types
    const assessmentBreakdown = await Assessment.aggregate([
        { $group: { _id: "$assessmentType", count: { $sum: 1 } } }
    ]);

    res.json({
        success: true,
        data: {
            totalUsers,
            pendingCases,
            totalAssessments,
            assessmentBreakdown
        }
    });
});

module.exports = {
    getSystemOverview
};
