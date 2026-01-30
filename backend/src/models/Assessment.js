const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessmentType: {
        type: String,
        enum: ['PHQ9', 'DASS21', 'GAD7', 'CIDI'],
        required: true
    },
    // Storing raw responses as an object (flexible structure)
    rawResponses: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true
    },
    // Computed scores often vary by test, so Map/Object is suitable, or specific fields
    computedScores: {
        type: Map,
        of: Number,
        required: true
    },
    severityLevel: {
        type: String, // e.g., 'None', 'Mild', 'Moderate', 'Severe'
        required: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Assessment', assessmentSchema);
