/**
 * User Service
 * Business logic for user profile, education, preferences, account settings
 */

const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { comparePassword, hashPassword } = require('../utils/password');
const { sendEmail } = require('../utils/email');
const { AppError, AuthenticationError } = require('../middleware/errorHandler');

/**
 * Get user profile
 * @param {String} userId - User ID
 * @returns {Object} User profile data
 */
exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select('-password -refreshTokens -otpCode -emailVerificationToken -passwordResetToken')
    .populate('subscriptionId', 'tier status renewalDate');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {Object} updateData - { firstName, lastName, phone, bio, profilePicture }
 * @returns {Object} Updated user data
 */
exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check for critical changes
  const criticalChange = updateData.email && updateData.email !== user.email;

  // Update allowed fields
  if (updateData.firstName) user.firstName = updateData.firstName.trim();
  if (updateData.lastName) user.lastName = updateData.lastName.trim();
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.bio) user.bio = updateData.bio.trim();
  if (updateData.profilePicture) user.profilePicture = updateData.profilePicture;

  await user.save();

  // If critical change, trigger 2FA in controller (optional)
  if (criticalChange) {
    // Implementation: Send OTP email
  }

  return user;
};

/**
 * Verify user role (for client-side localStorage verification)
 * @param {String} userId - User ID
 * @returns {Object} { role, subscriptionTier, permissions, timestamp }
 */
exports.verifyUserRole = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.status === 'suspended') {
    throw new AppError('User not found or suspended', 403);
  }

  return {
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    permissions: getPermissionsForRole(user.role),
    lastVerifiedAt: new Date().toISOString(),
    timestamp: Date.now(),
  };
};

/**
 * Change user password
 * @param {String} userId - User ID
 * @param {Object} data - { currentPassword, newPassword }
 */
exports.changeUserPassword = async (userId, data) => {
  const { currentPassword, newPassword } = data;
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Hash and update new password
  user.password = await hashPassword(newPassword);
  user.refreshTokens = []; // Invalidate all sessions
  await user.save();

  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: 'Password Changed - OmiHorizn',
    template: 'passwordChanged',
    data: {
      name: user.firstName,
      timestamp: new Date().toLocaleString(),
    },
  });
};

/**
 * Add education information
 * @param {String} userId - User ID
 * @param {Object} educationData - { degree, field, university, gpa, completionYear, country }
 * @returns {Object} Added education record
 */
exports.addEducation = async (userId, educationData) => {
  const { degree, field, university, gpa, completionYear, country } = educationData;
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const education = {
    degree,
    field,
    university,
    gpa: gpa || null,
    completionYear: completionYear || null,
    country: country || null,
    createdAt: new Date(),
  };

  user.education = user.education || [];
  user.education.push(education);
  await user.save();

  return education;
};

/**
 * Update education information
 * @param {String} userId - User ID
 * @param {String} educationId - Education record ID
 * @param {Object} updateData - Education fields to update
 * @returns {Object} Updated education record
 */
exports.updateEducation = async (userId, educationId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const education = (user.education || []).find(e => e._id.toString() === educationId);
  if (!education) {
    throw new AppError('Education record not found', 404);
  }

  const { degree, field, university, gpa, completionYear, country } = updateData;

  if (degree) education.degree = degree;
  if (field) education.field = field;
  if (university) education.university = university;
  if (gpa !== undefined) education.gpa = gpa;
  if (completionYear !== undefined) education.completionYear = completionYear;
  if (country) education.country = country;
  education.updatedAt = new Date();

  await user.save();

  return education;
};

/**
 * Delete education information
 * @param {String} userId - User ID
 * @param {String} educationId - Education record ID
 */
exports.deleteEducation = async (userId, educationId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.education = (user.education || []).filter(e => e._id.toString() !== educationId);
  await user.save();
};

/**
 * Get all education records
 * @param {String} userId - User ID
 * @returns {Array} Education records
 */
exports.getEducation = async (userId) => {
  const user = await User.findById(userId).select('education');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user.education || [];
};

/**
 * Update language preference
 * @param {String} userId - User ID
 * @param {String} language - Language code
 */
exports.updateLanguagePreference = async (userId, language) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.preferences = user.preferences || {};
  user.preferences.language = language;
  await user.save();

  return { language: user.preferences.language };
};

/**
 * Update notification preferences
 * @param {String} userId - User ID
 * @param {Object} data - { emailNotifications, pushNotifications, inAppNotifications }
 */
exports.updateNotificationPreferences = async (userId, data) => {
  const { emailNotifications, pushNotifications, inAppNotifications } = data;
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.preferences = user.preferences || {};
  if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
  if (pushNotifications !== undefined) user.preferences.pushNotifications = pushNotifications;
  if (inAppNotifications !== undefined) user.preferences.inAppNotifications = inAppNotifications;

  await user.save();

  return user.preferences;
};

/**
 * Update privacy preferences
 * @param {String} userId - User ID
 * @param {Object} data - { isPublic, allowMessaging, allowTracking }
 */
exports.updatePrivacyPreferences = async (userId, data) => {
  const { isPublic, allowMessaging, allowTracking } = data;
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.preferences = user.preferences || {};
  if (isPublic !== undefined) user.preferences.isPublic = isPublic;
  if (allowMessaging !== undefined) user.preferences.allowMessaging = allowMessaging;
  if (allowTracking !== undefined) user.preferences.allowTracking = allowTracking;

  await user.save();

  return user.preferences;
};

/**
 * Update communication preferences
 * @param {String} userId - User ID
 * @param {Object} data - { reminderFrequency, notificationChannels, timezone, quietHoursStart, quietHoursEnd }
 */
exports.updateCommunicationPreferences = async (userId, data) => {
  const { reminderFrequency, notificationChannels, timezone, quietHoursStart, quietHoursEnd } = data;
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.preferences = user.preferences || {};
  user.communication = user.communication || {};

  if (reminderFrequency) user.communication.reminderFrequency = reminderFrequency;
  if (notificationChannels) user.communication.notificationChannels = notificationChannels;
  if (timezone) user.preferences.timezone = timezone;
  
  if (quietHoursStart || quietHoursEnd) {
    user.communication.quietHours = user.communication.quietHours || {};
    if (quietHoursStart) user.communication.quietHours.start = quietHoursStart;
    if (quietHoursEnd) user.communication.quietHours.end = quietHoursEnd;
  }

  await user.save();

  return {
    communication: user.communication,
    timezone: user.preferences.timezone,
  };
};

/**
 * Get communication preferences
 * @param {String} userId - User ID
 * @returns {Object} Communication preferences
 */
exports.getCommunicationPreferences = async (userId) => {
  const user = await User.findById(userId).select('communication preferences');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    communication: user.communication || {},
    timezone: user.preferences?.timezone || 'UTC',
  };
};

/**
 * Soft delete account (30-day recovery window)
 * @param {String} userId - User ID
 * @param {String} password - User password for verification
 */
exports.deleteUserAccount = async (userId, password) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError('Password is incorrect');
  }

  // Soft delete
  user.status = 'deleted';
  user.deletedAt = new Date();
  user.recoveryDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await user.save();

  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: 'Your OmiHorizn Account Will Be Deleted',
    template: 'accountDeletion',
    data: {
      name: user.firstName,
      recoveryDeadline: user.recoveryDeadline.toDateString(),
      recoveryLink: `${process.env.FRONTEND_URL}/auth/recover-account`,
    },
  });
};

/**
 * Helper function to get permissions for role
 */
function getPermissionsForRole(role) {
  const permissions = {
    user: ['read:profile', 'write:profile', 'read:applications', 'write:applications'],
    admin: ['read:all', 'write:all', 'manage:users', 'manage:content'],
    moderator: ['read:content', 'moderate:comments', 'manage:reports'],
  };
  return permissions[role] || permissions.user;
}

/**
 * ============================================
 * ADMIN USER MANAGEMENT (Milestone 8.2)
 * ============================================
 */

/**
 * List users with pagination and optional search filter
 * @param {Object} options - { page, limit, search }
 * @returns {Object} result containing users array and pagination info
 */
exports.listUsers = async ({ page = 1, limit = 20, search = '' }) => {
  const query = {};
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshTokens -otpCode -twoFactorSecret')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get detailed information for a single user
 * @param {String} userId
 */
exports.getUser = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshTokens -otpCode -twoFactorSecret');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Change user status to suspended
 */
exports.suspendUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  user.status = 'suspended';
  await user.save();
  return user;
};

/**
 * Activate a suspended user
 */
exports.activateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  user.status = 'active';
  await user.save();
  return user;
};

/**
 * Soft-delete a user account (marks status deleted and sets recovery window)
 */
exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  user.status = 'deleted';
  user.deletedAt = new Date();
  user.recoveryDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await user.save();
  return user;
};

/**
 * Reset a user's password to a random temporary one and email it
 */
exports.resetAdminPassword = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const crypto = require('crypto');
  const tempPassword = crypto.randomBytes(6).toString('hex');
  user.password = await hashPassword(tempPassword);
  user.refreshTokens = [];
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Your password has been reset',
    template: 'adminResetPassword',
    data: {
      name: user.firstName,
      tempPassword,
    },
  });

  return { tempPassword };
};

/**
 * Return documents uploaded by a user
 */
exports.viewUserDocuments = async (userId) => {
  const Document = require('../models/Document');
  const docs = await Document.find({ userId }).select('-fileData').lean();
  return docs;
};

/**
 * Perform an action on a list of users
 * @param {Array<String>} userIds
 * @param {String} action - 'suspend' | 'activate' | 'delete'
 */
exports.bulkAction = async (userIds, action) => {
  const { ValidationError } = require('../middleware/errorHandler');
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ValidationError('userIds array is required');
  }
  const update = {};
  switch (action) {
    case 'suspend':
      update.status = 'suspended';
      break;
    case 'activate':
      update.status = 'active';
      break;
    case 'delete':
      update.status = 'deleted';
      update.deletedAt = new Date();
      update.recoveryDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      throw new ValidationError('Unknown bulk action');
  }

  await User.updateMany({ _id: { $in: userIds } }, { $set: update });
  return { modifiedCount: userIds.length };
};

/**
 * Approve a new registration (simply set status to active)
 */
exports.approveUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  user.status = 'active';
  await user.save();
  return user;
};

/**
 * Reject a registration (mark suspended)
 */
exports.rejectUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  user.status = 'suspended';
  await user.save();
  return user;
}
