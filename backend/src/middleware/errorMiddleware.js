const errorHandler = (err, req, res, next) => {
  // Determine status code
  const statusCode = err.statusCode ? err.statusCode : 500;

  // Default response
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'SERVER_ERROR';

  // Mongoose invalid ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    errorCode = 'RESOURCE_NOT_FOUND';
    res.status(404);
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    errorCode = 'VALIDATION_ERROR';
    res.status(400);
  } else {
    res.status(statusCode);
  }

  const response = {
    success: false,
    message,
    errorCode,
  };

  // Include stack trace only in non-production
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.json(response);
};

module.exports = { errorHandler };
