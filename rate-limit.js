const setRateLimit = require("express-rate-limit");

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests. You can only send 10 requests in a minute.",
  headers: true,
});

module.exports = rateLimitMiddleware;