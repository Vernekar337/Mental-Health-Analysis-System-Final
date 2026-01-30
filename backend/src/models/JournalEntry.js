const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    textContent: {
        type: String,
        // Optional because it might be audio-only initially, though usually text is extracted
    },
    // Path to temporary or stored audio file (or identifier)
    audioFilePath: {
        type: String
    },
    // Features extracted by ML service
    extractedAudioFeatures: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    sentimentScore: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
