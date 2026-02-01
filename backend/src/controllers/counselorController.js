const CaseFile = require('../models/CaseFile');
const asyncHandler = require('../middleware/asyncHandler');
const { validateEnum } = require('../utils/validationUtil');

// @desc    Get all cases (optionally filtered by status)
// @route   GET /api/counselor/cases
// @access  Private (Counselor/Admin)
const getCases = asyncHandler(async (req, res) => {
    const { status } = req.query;
    let query = {};
    
    if (status) {
        query.status = status;
    }

    const cases = await CaseFile.find(query)
        .populate('userId', 'name email age') // Populate student info
        .sort({ createdAt: -1 }); // Newest first
        
    res.json({ success: true, count: cases.length, data: cases });
});

// @desc    Decide on a case (Approve/Dismiss)
// @route   POST /api/counselor/cases/:id/decide
// @access  Private (Counselor)
const decideCase = asyncHandler(async (req, res) => {
    const { status, counselorNotes } = req.body; // status: 'Approved' | 'Dismissed'
    
    validateEnum(status, ['Approved', 'Dismissed'], 'Case Decision Status');

    const caseFile = await CaseFile.findById(req.params.id);

    if (!caseFile) {
        res.status(404);
        throw new Error('Case not found');
    }

    // CRITICAL: Prevent modifying already resolved cases
    if (caseFile.status !== 'Pending') {
        res.status(400); // Bad Request
        throw new Error(`Cannot modify case. Current status is ${caseFile.status}`);
    }

    caseFile.status = status;
    caseFile.counselorNotes = counselorNotes;
    caseFile.counselorId = req.user._id;
    caseFile.resolvedAt = Date.now();

    await caseFile.save();

    res.json({ success: true, caseFile });
});

module.exports = {
    getCases,
    decideCase
};
