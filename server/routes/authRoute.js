/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { authValidators, adminValidators, handleValidationErrors } = require('../validators');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

/**
 * 2.1 - Email + Password Authentication
 */

// Register
router.post(
  '/register',
  authValidators.register,
  handleValidationErrors,
  authController.register
);

// Verify email
router.post(
  '/verify-email',
  authValidators.verifyEmail,
  handleValidationErrors,
  authController.verifyEmail
);

// Login
router.post(
  '/login',
  authValidators.login,
  handleValidationErrors,
  authController.login
);

// Logout
router.post(
  '/logout',
  authenticateToken,
  authController.logout
);

// Forgot password
router.post(
  '/forgot-password',
  authValidators.forgotPassword,
  handleValidationErrors,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  authValidators.resetPassword,
  handleValidationErrors,
  authController.resetPassword
);

// Refresh token
router.post(
  '/refresh-token',
  authController.refreshToken
);

/**
 * 2.2 - Google OAuth Integration
 */

router.post(
  '/google/callback',
  authController.googleCallback
);

/**
 * 2.3 - Two-Factor Authentication (2FA)
 */

// Send OTP
router.post(
  '/2fa/send-otp',
  authenticateToken,
  authController.sendOTP
);

// Verify OTP
router.post(
  '/2fa/verify-otp',
  authenticateToken,
  authValidators.twoFAVerify,
  handleValidationErrors,
  authController.verifyOTP
);

/**
 * Activity Tracking
 */

// Update activity
router.post(
  '/update-activity',
  authenticateToken,
  authController.updateActivity
);

/**
 * ============================================
 * ADMIN AUTHENTICATION (Milestone 8.1)
 * ============================================
 */

// Admin login - does not require existing token
router.post(
  '/admin/login',
  adminValidators.auth.login,
  handleValidationErrors,
  userController.adminLogin
);

// Admin logout - requires valid token
router.post(
  '/admin/logout',
  authenticateToken,
  adminValidators.auth.logout,
  handleValidationErrors,
  userController.adminLogout
);

module.exports = router;
