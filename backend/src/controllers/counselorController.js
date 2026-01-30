const CaseFile = require('../models/CaseFile');

// @desc    Get all cases (optionally filtered by status)
// @route   GET /api/counselor/cases
// @access  Private (Counselor/Admin)
const getCases = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }

        const cases = await CaseFile.find(query)
            .populate('userId', 'name email age') // Populate student info
            .sort({ createdAt: -1 });
            
        res.json(cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching cases' });
    }
};

// @desc    Decide on a case (Approve/Dismiss)
// @route   POST /api/counselor/cases/:id/decide
// @access  Private (Counselor)
const decideCase = async (req, res) => {
    try {
        const { status, counselorNotes } = req.body; // status: 'Approved' | 'Dismissed'
        
        if (!['Approved', 'Dismissed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Approved or Dismissed.' });
        }

        const caseFile = await CaseFile.findById(req.params.id);

        if (!caseFile) {
            return res.status(404).json({ message: 'Case not found' });
        }

        caseFile.status = status;
        caseFile.counselorNotes = counselorNotes;
        caseFile.counselorId = req.user._id;
        caseFile.resolvedAt = Date.now();

        await caseFile.save();

        res.json({ success: true, caseFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating case' });
    }
};

module.exports = {
    getCases,
    decideCase
};
