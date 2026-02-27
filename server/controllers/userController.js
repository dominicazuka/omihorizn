/**
 * User Controller
 * HTTP layer for user profile/preferences - delegates business logic to userService
 * MVC Flow: Route → Controller → Service → Model → Database
 */

const userService = require('../services/userService');
const authService = require('../services/authService');

/**
 * 2.4 - User Profile Management
 */

/**
 * Get user profile
 * GET /api/user/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user._id, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Role verification endpoint (critical for security)
 * GET /api/auth/verify-role
 * Verifies user role and subscriptionTier match between client and server
 */
exports.verifyRole = async (req, res, next) => {
  try {
    const data = await userService.verifyUserRole(req.user._id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 * POST /api/user/change-password
 */
exports.changePassword = async (req, res, next) => {
  try {
    await userService.changeUserPassword(req.user._id, req.body);
    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Education Management
 */

/**
 * Add education info
 * POST /api/user/education
 */
exports.addEducation = async (req, res, next) => {
  try {
    const education = await userService.addEducation(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all education records
 * GET /api/user/education
 */
exports.getEducation = async (req, res, next) => {
  try {
    const education = await userService.getEducation(req.user._id);
    res.json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update education info
 * PUT /api/user/education/:id
 */
exports.updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const education = await userService.updateEducation(req.user._id, id, req.body);
    res.json({
      success: true,
      message: 'Education updated successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete education info
 * DELETE /api/user/education/:id
 */
exports.deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deleteEducation(req.user._id, id);
    res.json({
      success: true,
      message: 'Education deleted successfully',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Preferences Management
 */

/**
 * Update language preference
 * PUT /api/user/preferences/language
 */
exports.updateLanguagePreference = async (req, res, next) => {
  try {
    const data = await userService.updateLanguagePreference(req.user._id, req.body.language);
    res.json({
      success: true,
      message: 'Language preference updated',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update notification preferences
 * PUT /api/user/preferences/notifications
 */
exports.updateNotificationPreferences = async (req, res, next) => {
  try {
    const data = await userService.updateNotificationPreferences(req.user._id, req.body);
    res.json({
      success: true,
      message: 'Notification preferences updated',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update privacy preferences
 * PUT /api/user/preferences/privacy
 */
exports.updatePrivacyPreferences = async (req, res, next) => {
  try {
    const data = await userService.updatePrivacyPreferences(req.user._id, req.body);
    res.json({
      success: true,
      message: 'Privacy preferences updated',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update communication preferences
 * PUT /api/user/preferences/communication
 */
exports.updateCommunicationPreferences = async (req, res, next) => {
  try {
    const data = await userService.updateCommunicationPreferences(req.user._id, req.body);
    res.json({
      success: true,
      message: 'Communication preferences updated',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get communication preferences
 * GET /api/user/preferences/communication
 */
exports.getCommunicationPreferences = async (req, res, next) => {
  try {
    const data = await userService.getCommunicationPreferences(req.user._id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Account Settings
 */

/**
 * Soft delete account (30-day recovery window)
 * DELETE /api/user/account
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    await userService.deleteUserAccount(req.user._id, req.body.password);
    res.json({
      success: true,
      message: 'Account will be deleted in 30 days. You can recover it by logging in.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================================
 * ADMIN USER MANAGEMENT (Milestone 8.2)
 * ============================================
 */

/**
 * Admin: List all users with pagination and search
 * GET /api/user/admin/users
 */
exports.adminListUsers = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await userService.listUsers({ page, limit, search });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get user detail
 * GET /api/user/admin/users/:id
 */
exports.adminGetUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUser(id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Suspend user
 * POST /api/user/admin/users/:id/suspend
 */
exports.adminSuspendUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.suspendUser(id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Activate user
 * POST /api/user/admin/users/:id/activate
 */
exports.adminActivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.activateUser(id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Delete user (soft delete)
 * DELETE /api/user/admin/users/:id
 */
exports.adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Reset password
 * POST /api/user/admin/users/:id/reset-password
 */
exports.adminResetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.resetAdminPassword(id);
    res.json({ success: true, message: 'Password reset and emailed to user' });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: View user documents
 * GET /api/user/admin/users/:id/documents
 */
exports.adminViewUserDocuments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const docs = await userService.viewUserDocuments(id);
    res.json({ success: true, documents: docs });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Bulk action on users
 * POST /api/user/admin/bulk-action
 */
exports.adminBulkAction = async (req, res, next) => {
  try {
    const { userIds, action } = req.body;
    const result = await userService.bulkAction(userIds, action);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Approve user
 * POST /api/user/admin/users/:id/approve
 */
exports.adminApproveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.approveUser(id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Reject user
 * POST /api/user/admin/users/:id/reject
 */
exports.adminRejectUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.rejectUser(id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Login
 * POST /api/auth/admin/login
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password, deviceId, userAgent, ip, otpCode } = req.body;
    const data = await authService.loginAdmin({
      email,
      password,
      deviceId,
      userAgent,
      ip,
      otpCode,
    });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Logout
 * POST /api/auth/admin/logout
 */
exports.adminLogout = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { refreshToken } = req.body;
    await authService.logoutUser(userId, refreshToken);
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
