const User = require('../models/User');
const CaseFile = require('../models/CaseFile');
const Assessment = require('../models/Assessment');

// @desc    Get system overview stats
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getSystemOverview = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingCases = await CaseFile.countDocuments({ status: 'Pending' });
        const totalAssessments = await Assessment.countDocuments();
        
        // Aggregate breakdown of assessment types
        const assessmentBreakdown = await Assessment.aggregate([
            { $group: { _id: "$assessmentType", count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            pendingCases,
            totalAssessments,
            assessmentBreakdown
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching overview' });
    }
};

module.exports = {
    getSystemOverview
};
