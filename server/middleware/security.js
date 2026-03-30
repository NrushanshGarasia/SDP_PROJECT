const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security Headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // never rate-limit health checks
    return req.path === '/health' || req.path === '/api/health' || req.path === '/api/db-health';
  },
});

// Auth rate limiter (stricter for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 50 : 5,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Data Sanitization against NoSQL Injection
const sanitizeData = mongoSanitize();

// Data Sanitization against XSS
const sanitizeXSS = xss();

// Prevent HTTP Parameter Pollution
// Configure HPP to avoid conflicts with Express query parsing
const preventHPP = hpp({
  whitelist: [], // Allow all parameters, HPP will just clean duplicates
});

module.exports = {
  securityHeaders,
  limiter,
  authLimiter,
  sanitizeData,
  sanitizeXSS,
  preventHPP,
};
