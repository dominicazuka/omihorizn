/**
 * Main Express Application
 * Configures all middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken, optionalAuth } = require('./middleware/auth');
const { authorize, roleVerificationEndpoint } = require('./middleware/authorization');

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet()); // Set security HTTP headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit payment endpoints to 5 requests per hour
  message: 'Too many payment attempts, please try again later',
});

app.use('/api/', limiter);
app.use('/api/payments', paymentLimiter);

// ============================================
// CORS CONFIGURATION
// ============================================
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// COMPRESSION MIDDLEWARE
// ============================================
app.use(compression());

// ============================================
// LOGGING MIDDLEWARE
// ============================================
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed logging in production
} else {
  app.use(morgan('dev')); // Simple logging in development
}

// ============================================
// REQUEST ID TRACKING MIDDLEWARE
// ============================================
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Role verification endpoint (public for client role checking)
app.get('/api/auth/verify-role', authenticateToken, roleVerificationEndpoint);

// NOTE: Import route files when they are created
// Auth routes (to be created in routes/authRoutes.js)
// app.use('/api/auth', require('./routes/authRoutes'));

// User routes (to be created in routes/userRoutes.js)
// app.use('/api/user', require('./routes/userRoutes'));

// Application routes (to be created in routes/applicationRoutes.js)
// app.use('/api/applications', require('./routes/applicationRoutes'));

// Document routes (to be created in routes/documentRoutes.js)
// app.use('/api/documents', require('./routes/documentRoutes'));

// Upload routes (to be created in routes/uploadRoutes.js)
// app.use('/api/uploads', require('./routes/uploadRoutes'));

// Payment & Subscription routes
// app.use('/api/subscription', require('./routes/subscriptionRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));

// University routes (to be created in routes/universityRoutes.js)
// app.use('/api/universities', require('./routes/universityRoutes'));

// Program routes (to be created in routes/programRoutes.js)
// app.use('/api/programs', require('./routes/programRoutes'));

// Job routes (to be created in routes/jobRoutes.js)
// app.use('/api/jobs', require('./routes/jobRoutes'));

// Blog routes (to be created in routes/blogRoutes.js)
// app.use('/api/blogs', require('./routes/blogRoutes'));

// Professional Services routes
// app.use('/api/advisor', require('./routes/advisorRoutes'));
// app.use('/api/review', require('./routes/documentReviewRoutes'));
// app.use('/api/coaching', require('./routes/coachingRoutes'));
// app.use('/api/support', require('./routes/supportRoutes'));

// Admin routes (to be created in routes/adminRoutes.js)
// app.use('/api/admin', require('./routes/adminRoutes'));

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// ============================================
// GLOBAL ERROR HANDLER (MUST BE LAST)
// ============================================
app.use(errorHandler);

module.exports = app;
