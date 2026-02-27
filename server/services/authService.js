/**
 * Authentication Service
 * Business logic for auth operations (register, login, password reset, 2FA, etc.)
 */

const User = require('../models/User');
const Subscription = require('../models/Subscription');
const PremiumFeatureUsage = require('../models/PremiumFeatureUsage');
const { hashPassword, comparePassword } = require('../utils/password');
const { sendEmail } = require('../utils/email');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { FEATURES_BY_TIER } = require('../utils/constants');
const { ConflictError, AuthenticationError, ValidationError, AppError } = require('../middleware/errorHandler');
const { acquireLock, releaseLock } = require('./redis');
const crypto = require('crypto');

/**
 * Register a new user
 * @param {Object} userData - { email, password, firstName, lastName, phone }
 * @returns {Object} Created user data
 */
exports.registerUser = async (userData) => {
  const { email, password, firstName, lastName, phone } = userData;

  // Check duplicate email
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Create user
  const user = new User({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    phone: phone || null,
    emailVerificationToken,
    emailVerificationExpires,
    subscriptionTier: 'free',
  });

  await user.save();

  // Send verification email
  await sendEmail({
    to: user.email,
    subject: 'Verify Your OmiHorizn Email',
    template: 'emailVerification',
    data: {
      name: user.firstName,
      verificationLink: `${process.env.FRONTEND_URL}/auth/verify-email?token=${emailVerificationToken}`,
      expiresIn: '24 hours',
    },
  });

  return {
    userId: user._id,
    email: user.email,
    message: 'Verification link sent to your email',
  };
};

/**
 * Verify user email
 * @param {String} token - Email verification token
 * @returns {Object} Verified user data
 */
exports.verifyEmail = async (token) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired verification token');
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  // Send welcome email
  await sendEmail({
    to: user.email,
    subject: 'Welcome to OmiHorizn!',
    template: 'welcomeEmail',
    data: {
      name: user.firstName,
      loginLink: `${process.env.FRONTEND_URL}/auth/login`,
    },
  });

  return { userId: user._id };
};

/**
 * Login user with email and password
 * @param {Object} credentials - { email, password, deviceId, userAgent, ip }
 * @returns {Object} { accessToken, refreshToken, user }
 */
exports.loginUser = async (credentials) => {
  const { email, password, deviceId, userAgent, ip } = credentials;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check email verification
  if (!user.emailVerified) {
    throw new AuthenticationError('Please verify your email first');
  }

  // Check account status
  if (user.status === 'suspended') {
    throw new AuthenticationError('Account has been suspended');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    // Increment login attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
    await user.save();
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new AuthenticationError('Account locked. Try again later');
  }

  // Reset login attempts
  user.loginAttempts = 0;
  user.lockUntil = null;

  // Single Device Login: Invalidate previous tokens atomically
  const lockKey = `login_lock:${user._id}`;
  const acquiredLock = await acquireLock(lockKey);
  
  if (acquiredLock) {
    try {
      user.sessionVersion = (user.sessionVersion || 0) + 1;
    } finally {
      await releaseLock(lockKey);
    }
  }

  // Store device info
  user.lastLogin = new Date();
  user.lastActivity = new Date();
  user.ipAddress = ip;
  user.userAgent = userAgent;
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.role, user.subscriptionTier);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push({
    token: refreshToken,
    deviceId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    },
  };
};

/**
 * Logout user (invalidate refresh token)
 * @param {String} userId - User ID
 * @param {String} refreshToken - Refresh token to invalidate
 */
exports.logoutUser = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (refreshToken) {
    user.refreshTokens = (user.refreshTokens || []).filter(rt => rt.token !== refreshToken);
    await user.save();
  }
};

/**
 * Request password reset
 * @param {String} email - User email
 */
exports.requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    // Don't reveal if email exists (security)
    return;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  // Send reset email
  await sendEmail({
    to: user.email,
    subject: 'Reset Your OmiHorizn Password',
    template: 'resetPassword',
    data: {
      name: user.firstName,
      resetLink: `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`,
      expiresIn: '1 hour',
    },
  });
};

/**
 * Reset password with token
 * @param {String} token - Password reset token
 * @param {String} newPassword - New password
 */
exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  // Update password
  user.password = await hashPassword(newPassword);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.refreshTokens = []; // Invalidate all old tokens
  await user.save();

  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: 'Password Changed - OmiHorizn',
    template: 'passwordChanged',
    data: {
      name: user.firstName,
      loginLink: `${process.env.FRONTEND_URL}/auth/login`,
    },
  });
};

/**
 * Refresh access token
 * @param {String} refreshToken - Refresh token
 * @returns {Object} { accessToken }
 */
exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token is required');
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Check if refresh token exists
  const tokenRecord = (user.refreshTokens || []).find(rt => rt.token === refreshToken);
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user._id, user.role, user.subscriptionTier);

  return { accessToken: newAccessToken };
};

/**
 * Google OAuth callback handler
 * @param {Object} googleProfile - { email, name, picture, sub: googleId }
 * @returns {Object} { accessToken, refreshToken, user }
 */
exports.handleGoogleOAuth = async (googleProfile) => {
  const { email, name, picture, sub: googleId } = googleProfile;

  if (!email || !googleId) {
    throw new ValidationError('Invalid Google OAuth data');
  }

  // Check if user exists
  let user = await User.findOne({ $or: [{ email }, { googleId }] });

  if (!user) {
    // Create new user
    const nameParts = name.split(' ');
    user = new User({
      firstName: nameParts[0] || 'User',
      lastName: nameParts[1] || '',
      email: email.toLowerCase(),
      password: null,
      googleId,
      googleProfile: { name, picture },
      emailVerified: true,
      subscriptionTier: 'free',
    });
    await user.save();

    // Initialize free tier subscription
    const subscription = new Subscription({
      userId: user._id,
      tier: 'free',
      status: 'active',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await subscription.save();

    // Initialize feature usage tracking
    const featuresForTier = FEATURES_BY_TIER['free'] || [];
    for (const feature of featuresForTier) {
      await PremiumFeatureUsage.create({
        userId: user._id,
        featureId: feature._id,
        usageCount: 0,
        usageLimit: feature.freeLimit,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }
  } else if (!user.googleId) {
    // Link Google account to existing user
    user.googleId = googleId;
    user.googleProfile = { name, picture };
    await user.save();
  }

  // Check account status
  if (user.status === 'suspended') {
    throw new AuthenticationError('Account has been suspended');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.role, user.subscriptionTier);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  user.lastLogin = new Date();
  user.lastActivity = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    },
  };
};

/**
 * Send 2FA OTP code
 * @param {String} userId - User ID
 * @param {String} purpose - Purpose of OTP (critical-change, payment, admin-action)
 */
exports.sendOTPCode = async (userId, purpose) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Store OTP
  user.otpCode = otp;
  user.otpExpires = expiresAt;
  user.otpPurpose = purpose;
  await user.save();

  // Send OTP email
  await sendEmail({
    to: user.email,
    subject: 'Your OmiHorizn Security Code',
    template: 'otp',
    data: {
      name: user.firstName,
      otp,
      expiresIn: '5 minutes',
      purpose,
    },
  });

  return { expiresIn: 5 * 60 };
};

/**
 * Verify 2FA OTP code
 * @param {String} userId - User ID
 * @param {String} otpCode - OTP code to verify
 */
exports.verifyOTPCode = async (userId, otpCode) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.otpCode || user.otpExpires < new Date()) {
    throw new ValidationError('OTP expired or not requested');
  }

  if (user.otpCode !== otpCode) {
    throw new ValidationError('Invalid OTP code');
  }

  // Clear OTP
  user.otpCode = null;
  user.otpExpires = null;
  user.otpPurpose = null;
  user.twoFactorEnabled = true;
  await user.save();

  return { verified: true };
};

/**
 * Login helper specifically for admin users. It wraps the standard loginUser logic
 * but performs an additional role check and enforces OTP if necessary.
 * @param {Object} credentials - { email, password, deviceId, userAgent, ip, otpCode }
 * @returns {Object} { accessToken, refreshToken, user }
 */
exports.loginAdmin = async (credentials) => {
  const { email, otpCode } = credentials;

  // ensure the target account exists and is an admin before proceeding
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.role !== 'admin') {
    throw new AuthenticationError('Admin credentials required');
  }

  // if 2FA is enabled require otpCode to be provided and valid
  if (user.twoFactorEnabled) {
    if (!otpCode) {
      throw new AuthenticationError('OTP code required for admin login');
    }
    // this will also set twoFactorEnabled true if it was not yet
    await exports.verifyOTPCode(user._id, otpCode);
  }

  // delegate to regular loginUser which handles all session tracking,
  // password verification, token generation, etc.
  return await exports.loginUser(credentials);
};

/**
 * Update user last activity
 * @param {String} userId - User ID
 */
exports.updateUserActivity = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.lastActivity = new Date();
  await user.save();
};
