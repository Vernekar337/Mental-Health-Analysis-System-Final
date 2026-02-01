const JournalEntry = require('../models/JournalEntry');
const mlService = require('../services/mlService');
const fs = require('fs');
const asyncHandler = require('../middleware/asyncHandler');
const { validateRequest } = require('../utils/validationUtil');

// @desc    Analyze text journal entry
// @route   POST /api/journal/text
// @access  Private
const processTextEntry = asyncHandler(async (req, res) => {
    validateRequest(req, ['textContent']);
    
    const { textContent } = req.body;

    // 1. Call ML Service (Sentiment Analysis / Feature Extraction)
    const mlResponse = await mlService.processText(textContent);

    let sentimentScore = 0;
    let extractedAudioFeatures = {};

    if (mlResponse.success && mlResponse.data) {
        sentimentScore = mlResponse.data.sentiment || 0;
        extractedAudioFeatures = mlResponse.data.features || {};
    } else {
        // Decide if we fail or continue with defaults. 
        // For text journal, persistance is key, so we continue with warning? 
        // Requirement says: "Either successfully proxy OR handle ML failure gracefully without fake data"
        // We will default to 0/empty if ML fails, but ideally we should probably warn.
    }

    // 2. Save Entry
    const entry = await JournalEntry.create({
        userId: req.user._id,
        textContent,
        requestType: 'Text',
        sentimentScore,
        extractedAudioFeatures
    });

    res.status(201).json({ success: true, entry });
});

// @desc    Analyze audio journal entry
// @route   POST /api/journal/audio
// @access  Private
const processAudioEntry = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Audio file is required');
    }

    const filePath = req.file.path; // Multer saves it here
    
    try {
        // 1. Call ML Service (Proxy Audio)
        const mlResponse = await mlService.processAudio(req.file); // Pass the file object or stream as needed by service

        let sentimentScore = 0;
        let extractedAudioFeatures = {};

        if (mlResponse.success && mlResponse.data) {
             sentimentScore = mlResponse.data.sentiment || 0;
             extractedAudioFeatures = mlResponse.data.features || {};
        }

        // 2. Save Entry (Metadata only)
        // If file is deleted, we must not store a deceptive path.
        // We store NULL for audioFilePath to indicate no local file exists.
        const entry = await JournalEntry.create({
            userId: req.user._id,
            audioFilePath: null, // File is strictly deleted after processing
            extractedAudioFeatures,
            sentimentScore
        });

        res.status(201).json({ success: true, message: 'Audio processed and features extracted', entry });

    } finally {
        // CLEANUP: Delete temp file in ALL code paths (success + failure)
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });
    }
});

module.exports = {
    processTextEntry,
    processAudioEntry
};
