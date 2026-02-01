// Verification Script for Refactored Controllers
// This script asserts that controllers can be imported and contain expected functions.
// It does NOT run them against a live DB (to avoid env issues), but ensures syntax validity.

console.log('Verifying Controllers...');

try {
    const authController = require('../src/controllers/authController');
    const assessmentController = require('../src/controllers/assessmentController');
    const journalController = require('../src/controllers/journalController');
    const counselorController = require('../src/controllers/counselorController');
    const adminController = require('../src/controllers/adminController');
    const mlController = require('../src/controllers/internalMlController');

    const assertFunction = (name, fn) => {
        if (typeof fn !== 'function') {
            throw new Error(`${name} is not a function`);
        }
        console.log(`✅ ${name} exists`);
    };

    assertFunction('authController.registerUser', authController.registerUser);
    assertFunction('authController.loginUser', authController.loginUser);
    
    assertFunction('assessmentController.submitAssessment', assessmentController.submitAssessment);
    assertFunction('assessmentController.getAssessmentHistory', assessmentController.getAssessmentHistory);

    assertFunction('journalController.processTextEntry', journalController.processTextEntry);
    assertFunction('journalController.processAudioEntry', journalController.processAudioEntry);

    assertFunction('counselorController.getCases', counselorController.getCases);
    assertFunction('counselorController.decideCase', counselorController.decideCase);

    assertFunction('adminController.getSystemOverview', adminController.getSystemOverview);

    assertFunction('mlController.proxyPredict', mlController.proxyPredict);

    console.log('\nSuccess! All controllers imported and contain expected functions.');
} catch (error) {
    console.error('\n❌ Verification Failed:', error.message);
    console.error(error.stack);
    process.exit(1);
}
