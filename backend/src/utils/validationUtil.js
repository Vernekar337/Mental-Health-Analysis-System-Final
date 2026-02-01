const mongoose = require('mongoose');

const validateRequest = (req, fields) => {
    const missing = [];
    fields.forEach(field => {
        if (!req.body[field]) missing.push(field);
    });

    if (missing.length > 0) {
        const error = new Error(`Missing required fields: ${missing.join(', ')}`);
        error.name = 'ValidationError';
        error.statusCode = 400;
        throw error;
    }
};

const validateObjectId = (id, fieldName = 'ID') => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}: ${id}`);
        error.name = 'CastError';
        error.statusCode = 400;
        throw error;
    }
};

const validateEnum = (value, allowedValues, fieldName) => {
    if (!allowedValues.includes(value)) {
        const error = new Error(`Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`);
        error.name = 'ValidationError';
        error.statusCode = 400;
        throw error;
    }
};

module.exports = {
    validateRequest,
    validateObjectId,
    validateEnum
};
