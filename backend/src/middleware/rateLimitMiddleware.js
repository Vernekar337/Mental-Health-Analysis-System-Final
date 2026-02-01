const rateLimit = require('express-rate-limit');

// Basic rate limiter for Auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: {
        success: false,
        message: 'Too many login/register attempts from this IP, please try again after 15 minutes',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for Journal/Assessment routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many API requests from this IP, please try again later',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for Internal ML routes (even though they are admin only, extra safety)
const internalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        message: 'Too many internal requests',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    }
});

module.exports = {
    authLimiter,
    apiLimiter,
    internalLimiter
};
