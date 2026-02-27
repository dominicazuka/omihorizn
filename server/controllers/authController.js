/**
 * Authentication Controller
 * HTTP layer for auth operations - delegates business logic to authService
 * MVC Flow: Route → Controller → Service → Model → Database
 */

const authService = require('../services/authService');

/**
 * 2.1 - Email + Password Authentication
 */

/**
 * Register new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email address
 * POST /api/auth/verify-email
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const data = await authService.verifyEmail(token);
    
    res.json({
      success: true,
      message: 'Email verified successfully. Welcome to OmiHorizn!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password, deviceId } = req.body;
    
    const credentials = {
      email,
      password,
      deviceId,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };
    
    const data = await authService.loginUser(credentials);
    
    res.json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutUser(req.user._id, refreshToken);
    
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    
    res.json({
      success: true,
      message: 'Password reset link sent to your email. Check your inbox.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    await authService.resetPassword(token, password);
    
    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refreshAccessToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Access token refreshed',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2.2 - Google OAuth Integration
 */

/**
 * Google OAuth callback
 * POST /api/auth/google/callback
 */
exports.googleCallback = async (req, res, next) => {
  try {
    const googleProfile = req.body;
    const data = await authService.handleGoogleOAuth(googleProfile);
    
    res.json({
      success: true,
      message: 'Google OAuth successful',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2.3 - Two-Factor Authentication (2FA)
 */

/**
 * Send OTP code
 * POST /api/auth/2fa/send-otp
 */
exports.sendOTP = async (req, res, next) => {
  try {
    const { purpose } = req.body;
    const data = await authService.sendOTPCode(req.user._id, purpose);
    
    res.json({
      success: true,
      message: 'OTP code sent to your email',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP code
 * POST /api/auth/2fa/verify-otp
 */
exports.verifyOTP = async (req, res, next) => {
  try {
    const { otpCode } = req.body;
    const data = await authService.verifyOTPCode(req.user._id, otpCode);
    
    res.json({
      success: true,
      message: '2FA verified successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Activity Tracking
 */

/**
 * Update user activity timestamp (for inactivity tracking)
 * POST /api/auth/update-activity
 */
exports.updateActivity = async (req, res, next) => {
  try {
    await authService.updateUserActivity(req.user._id);
    
    res.json({
      success: true,
      message: 'Activity updated',
    });
  } catch (error) {
    next(error);
  }
};