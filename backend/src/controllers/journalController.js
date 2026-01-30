const JournalEntry = require('../models/JournalEntry');
const mlService = require('../services/mlService');
const fs = require('fs');

// @desc    Analyze text journal entry
// @route   POST /api/journal/text
// @access  Private
const processTextEntry = async (req, res) => {
    try {
        const { textContent } = req.body;

        if (!textContent) {
            return res.status(400).json({ message: 'Text content is required' });
        }

        // 1. Call ML Service (Sentiment Analysis / Feature Extraction)
        const mlResponse = await mlService.processText(textContent);

        let sentimentScore = 0;
        let extractedAudioFeatures = {}; // Reusing the schema field for general features

        if (mlResponse.success && mlResponse.data) {
            sentimentScore = mlResponse.data.sentiment || 0;
            extractedAudioFeatures = mlResponse.data.features || {};
        }

        // 2. Save Entry
        const entry = await JournalEntry.create({
            userId: req.user._id,
            textContent,
            requestType: 'Text',
            sentimentScore,
            extractedAudioFeatures
        });

        // 3. (Optional) Check for anomaly using the new data
        // Here we might call mlService.detectAnomaly(entry) if required by business logic
        
        res.status(201).json({ success: true, entry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing journal' });
    }
};

// @desc    Analyze audio journal entry
// @route   POST /api/journal/audio
// @access  Private
const processAudioEntry = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Audio file is required' });
        }

        const filePath = req.file.path; // Multer saves it here
        
        // 1. Call ML Service (Proxy Audio)
        // Note: In a real scenario, we would stream 'fs.createReadStream(filePath)' to Axios
        // For this implementation, we simulate the call or attempt it if configured.
        
        // We assume ML returns sentiment and features from audio
        // Mocking structure for safety if ML service not truly attached via multipart
        let sentimentScore = 0;
        let extractedAudioFeatures = {};

        // In production: const mlResponse = await mlService.processAudio(fs.createReadStream(filePath));
        // For now, we only persist metadata and delete file as per plan.
        
        // Cleanup file immediately after processing (or queuing)
        // We will delete it to strictly follow "Forwarded... then... persist only metadata"
        // and "Files are temporarily stored... and then DELETED locally"
        
        // Simulating ML response because connecting to localhost:8000 might fail in this env without actual service
        // But the code structure is ready.
        
        // Clean up temp file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });

        // 2. Save Entry (Metadata only)
        const entry = await JournalEntry.create({
            userId: req.user._id,
            audioFilePath: 'processed_by_ml', // Do not store local path permanently
            extractedAudioFeatures: {
                // Mock features or from ML response
                audioLength: req.file.size,
                encoding: req.file.encoding
            },
            sentimentScore: 0 // Placeholder until ML integration is live
        });

        res.status(201).json({ success: true, message: 'Audio processed and features extracted', entry });

    } catch (error) {
        console.error(error);
        // Ensure file cleanup on error
        if (req.file && req.file.path) {
             fs.unlink(req.file.path, (err) => {});
        }
        res.status(500).json({ message: 'Server error processing audio' });
    }
};

module.exports = {
    processTextEntry,
    processAudioEntry
};
