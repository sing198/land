const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const env = require('./src/config/env');
const { testConnection } = require('./src/config/database');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// 1. Security & HTTP Header Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or matching origins
    if (!origin || env.CORS_ORIGIN.includes(origin) || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Request Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Rate Limiting (Prevent Brute-Force & Abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'คำขอมากเกินไป กรุณารอสักครู่ก่อนทำรายการใหม่'
  }
});
app.use('/api/', limiter);

// 5. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Serve Static Uploaded Files
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// 7. Mount Main API Routes
app.use('/api/v1', apiRoutes);

// Compatibility fallback for legacy /uploads endpoint
app.use('/api/getUserRole', (req, res) => {
  res.json({ role: 3, message: 'Legacy fallback endpoint' });
});

// 8. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบ Endpoint ที่เรียก: ${req.method} ${req.originalUrl}`
  });
});

// 9. Centralized Error Handler
app.use(errorHandler);

// 10. Start Server and Test DB Connection
const server = app.listen(env.PORT, async () => {
  console.log('='.repeat(60));
  console.log(`🚀 ALRO Land Management API Server v2.0 is running!`);
  console.log(`📡 URL: http://localhost:${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`📂 API Base: http://localhost:${env.PORT}/api/v1`);
  console.log('='.repeat(60));

  // Test Database Connection
  await testConnection();
});

// Graceful Shutdown Handler
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
