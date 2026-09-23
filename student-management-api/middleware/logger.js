// middleware/logger.js
// Custom logger middleware.
// Express middleware is just a function with (req, res, next).
// It runs BEFORE the route handler, and must call next() to pass
// control along — otherwise the request hangs forever.

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next(); // hand off to the next middleware / route handler
};

module.exports = logger;
