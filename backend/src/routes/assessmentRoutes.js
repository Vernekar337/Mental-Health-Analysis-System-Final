const express = require('express');
const router = express.Router();
const { submitAssessment, getAssessmentHistory } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimitMiddleware');

router.route('/')
    .post(protect, apiLimiter, submitAssessment);

router.route('/history')
    .get(protect, apiLimiter, getAssessmentHistory);

module.exports = router;
