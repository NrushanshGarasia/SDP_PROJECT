const express = require('express');
const cors = require('cors');
const path = require('path');

// Load .env from root directory (works from both root and server directory)
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const connectDB = require('./config/database');
const {
  securityHeaders,
  limiter,
  sanitizeData,
  sanitizeXSS,
  // preventHPP, // Temporarily disabled due to Express 5.x compatibility issue
} = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB (non-blocking)
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// CORS Configuration (must be before other middleware)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // In production, add your frontend domain here
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Fix for Express 5.x: Make req.query writable for express-validator compatibility
app.use((req, res, next) => {
  // Create a writable copy of req.query
  const query = { ...req.query };
  Object.defineProperty(req, 'query', {
    get: () => query,
    set: (value) => {
      Object.assign(query, value);
    },
    enumerable: true,
    configurable: true,
  });
  next();
});

// Body Parser (must be before HPP)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Middleware
app.use(securityHeaders);
app.use(limiter);
app.use(sanitizeData);
app.use(sanitizeXSS);
// HPP temporarily disabled due to Express 5.x compatibility issue with req.query
// app.use(preventHPP);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint under /api (for frontend proxy consistency)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// DB health endpoint (helps debug Mongo connection)
app.get('/api/db-health', async (req, res) => {
  const mongoose = require('mongoose');
  const readyState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  try {
    if (readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        readyState,
        message: 'MongoDB is not connected',
      });
    }
    // Ping admin DB
    await mongoose.connection.db.admin().ping();
    return res.json({
      status: 'ok',
      readyState,
      message: 'MongoDB connected and ping successful',
    });
  } catch (err) {
    return res.status(503).json({
      status: 'error',
      readyState,
      message: err.message || 'MongoDB ping failed',
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hostel Management System API' });
});

// API Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const roomRoutes = require('./routes/rooms');
const feeRoutes = require('./routes/fees');
const complaintRoutes = require('./routes/complaints');
const leaveRequestRoutes = require('./routes/leaveRequests');
const visitorRoutes = require('./routes/visitors');
const noticeRoutes = require('./routes/notices');
const messRoutes = require('./routes/mess');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/mess', messRoutes);

// 404 handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}/api`);
});
