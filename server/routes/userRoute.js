/**
 * User Routes
 * User profile & preferences endpoints
 */

const express = require('express');
const router = express.Router();
const { userValidators, adminValidators, handleValidationErrors } = require('../validators');
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

/**
 * 2.4 - User Profile Management
 */

// Get user profile
router.get(
  '/profile',
  authenticateToken,
  userController.getProfile
);

// Update user profile
router.put(
  '/profile',
  authenticateToken,
  userValidators.updateProfile,
  handleValidationErrors,
  userController.updateProfile
);

// Change password
router.post(
  '/change-password',
  authenticateToken,
  userValidators.changePassword,
  handleValidationErrors,
  userController.changePassword
);

/**
 * Education Management
 */

// Add education
router.post(
  '/education',
  authenticateToken,
  userValidators.addEducation,
  handleValidationErrors,
  userController.addEducation
);

// Get all education records
router.get(
  '/education',
  authenticateToken,
  userController.getEducation
);

// Update education
router.put(
  '/education/:id',
  authenticateToken,
  userValidators.addEducation,
  handleValidationErrors,
  userController.updateEducation
);

// Delete education
router.delete(
  '/education/:id',
  authenticateToken,
  userController.deleteEducation
);

/**
 * Preferences Management
 */

// Update language preference
router.put(
  '/preferences/language',
  authenticateToken,
  userValidators.updatePreferences,
  handleValidationErrors,
  userController.updateLanguagePreference
);

// Update notification preferences
router.put(
  '/preferences/notifications',
  authenticateToken,
  userController.updateNotificationPreferences
);

// Update privacy preferences
router.put(
  '/preferences/privacy',
  authenticateToken,
  userController.updatePrivacyPreferences
);

// Update communication preferences
router.put(
  '/preferences/communication',
  authenticateToken,
  userValidators.updatePreferences,
  handleValidationErrors,
  userController.updateCommunicationPreferences
);

// Get communication preferences
router.get(
  '/preferences/communication',
  authenticateToken,
  userController.getCommunicationPreferences
);

/**
 * Account Settings
 */

// Delete account
router.delete(
  '/account',
  authenticateToken,
  userValidators.changePassword,
  handleValidationErrors,
  userController.deleteAccount
);

/**
 * ============================================
 * ADMIN USER MANAGEMENT (Milestone 8.2)
 * ============================================
 */

const { requireRole } = require('../middleware/auth');

// All admin routes require authentication and admin role

// List all users with pagination and search
router.get(
  '/admin/users',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.list,
  handleValidationErrors,
  userController.adminListUsers
);

// Get user detail
router.get(
  '/admin/users/:id',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.get,
  handleValidationErrors,
  userController.adminGetUser
);

// Suspend user
router.post(
  '/admin/users/:id/suspend',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.suspend,
  handleValidationErrors,
  userController.adminSuspendUser
);

// Activate user
router.post(
  '/admin/users/:id/activate',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.activate,
  handleValidationErrors,
  userController.adminActivateUser
);

// Delete user (soft delete)
router.delete(
  '/admin/users/:id',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.delete,
  handleValidationErrors,
  userController.adminDeleteUser
);

// Reset password
router.post(
  '/admin/users/:id/reset-password',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.resetPassword,
  handleValidationErrors,
  userController.adminResetPassword
);

// View user documents
router.get(
  '/admin/users/:id/documents',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.viewDocs,
  handleValidationErrors,
  userController.adminViewUserDocuments
);

// Bulk action on users
router.post(
  '/admin/bulk-action',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.bulkAction,
  handleValidationErrors,
  userController.adminBulkAction
);

// Approve user
router.post(
  '/admin/users/:id/approve',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.approve,
  handleValidationErrors,
  userController.adminApproveUser
);

// Reject user
router.post(
  '/admin/users/:id/reject',
  authenticateToken,
  requireRole('admin'),
  adminValidators.user.reject,
  handleValidationErrors,
  userController.adminRejectUser
);

module.exports = router;
