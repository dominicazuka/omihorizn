/**
 * Application Routes
 * 
 * MVC Layer: HTTP Endpoint Definitions
 * Responsibility: Define routes, apply validators, call controller methods
 * Flow: Route → Validator → Controller → Service → Model → Database
 * 
 * All endpoints protected by JWT authentication middleware
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { applicationValidators, handleValidationErrors } = require('../validators');
const applicationController = require('../controllers/applicationController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * POST /api/applications
 * Create new application
 */
router.post(
  '/',
  applicationValidators.create,
  handleValidationErrors,
  applicationController.createApplication
);

/**
 * GET /api/applications
 * Get user's applications with filters
 */
router.get(
  '/',
  applicationValidators.listWithPagination,
  handleValidationErrors,
  applicationController.getUserApplications
);

/**
 * GET /api/applications/stats/overview
 * Get application statistics
 */
router.get(
  '/stats/overview',
  applicationController.getApplicationStats
);

/**
 * GET /api/applications/search
 * Search applications with filters
 */
router.get(
  '/search',
  applicationController.searchApplications
);

/**
 * GET /api/applications/:applicationId
 * Get single application
 */
router.get(
  '/:applicationId',
  applicationController.getApplicationById
);

/**
 * GET /api/applications/:applicationId/progress
 * Get application progress
 */
router.get(
  '/:applicationId/progress',
  applicationController.getApplicationProgress
);

/**
 * PUT /api/applications/:applicationId
 * Update application details
 */
router.put(
  '/:applicationId',
  applicationValidators.update,
  handleValidationErrors,
  applicationController.updateApplication
);

/**
 * PATCH /api/applications/:applicationId/status
 * Update application status
 */
router.patch(
  '/:applicationId/status',
  applicationValidators.updateStatus,
  handleValidationErrors,
  applicationController.updateApplicationStatus
);

/**
 * POST /api/applications/:applicationId/documents
 * Add document to application
 */
router.post(
  '/:applicationId/documents',
  applicationValidators.addDocument,
  handleValidationErrors,
  applicationController.addApplicationDocument
);

/**
 * DELETE /api/applications/:applicationId/documents/:documentId
 * Remove document from application
 */
router.delete(
  '/:applicationId/documents/:documentId',
  applicationValidators.removeDocument,
  handleValidationErrors,
  applicationController.removeApplicationDocument
);

/**
 * DELETE /api/applications/:applicationId
 * Delete application
 */
router.delete(
  '/:applicationId',
  applicationValidators.delete,
  handleValidationErrors,
  applicationController.deleteApplication
);

module.exports = router;
