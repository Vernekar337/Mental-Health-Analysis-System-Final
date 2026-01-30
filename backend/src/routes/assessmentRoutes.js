const express = require('express');
const router = express.Router();
const { submitAssessment, getAssessmentHistory } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, submitAssessment);

router.route('/history')
    .get(protect, getAssessmentHistory);

module.exports = router;
