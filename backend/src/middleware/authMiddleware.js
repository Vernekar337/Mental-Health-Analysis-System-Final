const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const err = new Error('Not authorized, no token provided');
    err.statusCode = 401;
    return next(err);
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const err = new Error(
      error.name === 'TokenExpiredError'
        ? 'Token expired, please login again'
        : 'Invalid token'
    );
    err.statusCode = 401;
    return next(err);
  }

  // 3. Validate payload
  if (!decoded || !decoded.id) {
    const err = new Error('Invalid token payload');
    err.statusCode = 401;
    return next(err);
  }

  // 4. Load user
  const userId = decoded.id || decoded._id;

    const user = await User.findById(userId).select('-passwordHash');
  

  if (!user) {
    const err = new Error('User not found or inactive');
    err.statusCode = 401;
    return next(err);
  }

  // 5. Attach user
  req.user = user;
  next();
});

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('User not authenticated');
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error(
        `Role '${req.user.role}' is not authorized to access this route`
      );
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

module.exports = { protect, authorize };
