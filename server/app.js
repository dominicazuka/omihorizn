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

// ============================================
// ORIGIN ALLOWLIST HELPER
// ============================================
// Determines whether an Origin header is allowed by the server CORS policy.
// Uses `FRONTEND_URL` env var when provided; allows localhost/dev origins
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
function isAllowedOrigin(origin) {
  if (!origin) return false; // handled separately for native/mobile clients (no Origin)
  if (origin === FRONTEND_URL) return true;

  // Allow common local development hostnames
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
    return true;
  }

  // Allow same-production domain and subdomains (e.g. api.omihorizn.com calls from app.omihorizn.com)
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith('omihorizn.com')) return true;
  } catch (e) {
    // ignore parse errors and fall through
  }

  return false;
}

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken, optionalAuth, roleVerificationEndpoint } = require('./middleware/auth');

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
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // mobile/native clients
    if (isAllowedOrigin(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  }
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

// ============================================
// AUTHENTICATION & CORE FEATURES
// ============================================

// Auth routes (includes admin login at /api/auth/admin/login)
app.use('/api/auth', require('./routes/authRoute'));

// User routes (includes admin user management at /api/user/admin/users)
app.use('/api/user', require('./routes/userRoute'));

// Application routes
app.use('/api/applications', require('./routes/applicationRoute'));

// Document routes
app.use('/api/documents', require('./routes/documentRoute'));

// Upload routes
app.use('/api/uploads', require('./routes/uploadRoute'));

// ============================================
// PAYMENTS & SUBSCRIPTIONS 
// ============================================

// Pricing routes (public - used by frontend for dynamic pricing)
app.use('/api/pricing', require('./routes/pricingRoute'));


// AI utility routes (embeddings, generation, vector search)
app.use('/api/ai', require('./routes/aiRoute'));

// Payment & Subscription routes
app.use('/api/subscription', require('./routes/subscriptionRoute'));
app.use('/api/payments', require('./routes/paymentRoute'));

// Analytics routes (admin only)
app.use('/api/analytics', require('./routes/analyticsRoute'));

// Professional services: advisor, review, coaching, support
app.use('/api/advisor', require('./routes/advisorRoute'));
app.use('/api/review', require('./routes/documentReviewRoute'));
app.use('/api/coaching', require('./routes/coachingRoute'));
app.use('/api/support', require('./routes/supportRoute'));

// ============================================
// UNIVERSITIES, PROGRAMS & COUNTRIES
// ============================================

// University routes (public: list, search, detail; admin: create, update, delete, bulk-import)
app.use('/api/universities', require('./routes/universityRoute'));

// Program routes (public: list, search, detail; admin: create, update, delete, bulk-import)
app.use('/api/programs', require('./routes/programRoute'));

// Country routes (public: list, detail, visa guides, cost of living; admin: create, update, delete, bulk-import)
app.use('/api/countries', require('./routes/countryRoute'));

// ============================================
// ADMIN DATA MANAGEMENT & VISA INTELLIGENCE 
// ============================================

// Generic admin data import/export
app.use('/api/admin-data', require('./routes/adminDataRoute'));

// Visa intelligence engines
app.use('/api/visa', require('./routes/visaEngineRoute'));

// Visa data endpoints
app.use('/api/visa-data', require('./routes/visaDataRoute'));

// Dependent/family visa info
app.use('/api/visa', require('./routes/dependentVisaRoute'));

// Settlement planning routes
app.use('/api/settlement', require('./routes/settlementRoute'));

// Post-acceptance & application checklist
app.use('/api', require('./routes/postAcceptanceRoute'));

// Notifications
app.use('/api/notifications', require('./routes/notificationRoute'));

// ============================================
// PHASE 9.5: CAREERS & JOB POSTINGS (Milestone 9.5)
// ============================================

// Job posting routes (public & admin)
app.use('/api/careers/jobs', require('./routes/jobPostingRoute'));

// Job application routes (user & admin)
app.use('/api/careers/applications', require('./routes/jobApplicationRoute'));

// ============================================
// PHASE 10: BLOG & NEWSLETTER (Milestone 10)
// ============================================

// Blog routes
app.use('/api/blogs', require('./routes/blogRoute'));
app.use('/api/blogs/:slug/comments', require('./routes/blogCommentRoute'));

// Newsletter routes
app.use('/api/newsletter', require('./routes/newsletterRoute'));

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
