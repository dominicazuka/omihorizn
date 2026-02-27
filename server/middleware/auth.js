/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts user information
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.userId;

    // Fetch full user data for verification
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      return res.status(403).json({
        success: false,
        message: 'User account is not active',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.status === 'active') {
        req.user = user;
        req.userId = user._id;
      }
    }
    next();
  } catch (error) {
    // Silently fail - optional auth
    next();
  }
};

// existing imports remain valid and we have a single canonical import point.
const { authorize, roleVerificationEndpoint } = require('./authorization');

module.exports = {
  authenticateToken,
  optionalAuth,
  // alias for authorization.authorize - usage: requireRole('admin')
  requireRole: authorize,
  // alias for the verification endpoint used by the client
  roleVerificationEndpoint,
};
