/**
 * Program Routes
 * All routes for program management (public and admin)
 * Validators imported from /server/validators/index.js
 */

const express = require('express');
const programController = require('../controllers/programController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { programValidators, handleValidationErrors } = require('../validators/index');

const router = express.Router();

/**
 * ============================================
 * PUBLIC ENDPOINTS (No authentication required)
 * ============================================
 */

/**
 * GET /api/programs
 * List programs with pagination and filters
 * Query params: page, pageSize, universityId, field, degree, search
 */
router.get(
  '/',
  programValidators.list || [],
  handleValidationErrors,
  programController.listPrograms
);

/**
 * GET /api/programs/:id
 * Get program detail
 * Params: id (MongoDB ObjectId)
 */
router.get(
  '/:id',
  programValidators.getDetail || [],
  handleValidationErrors,
  programController.getProgramDetail
);

/**
 * GET /api/universities/:universityId/programs
 * Get programs for specific university
 * Params: universityId (MongoDB ObjectId)
 */
router.get(
  '/by-university/:universityId',
  programController.getProgramsByUniversity
);

/**
 * GET /api/programs/search
 * Search programs by text and filters
 * Query params: q, field, degree, minTuition, maxTuition, limit
 */
router.get(
  '/search',
  programValidators.search || [],
  handleValidationErrors,
  programController.searchPrograms
);

/**
 * GET /api/programs/statistics
 * Get programs statistics
 */
router.get(
  '/stats',
  programController.getStatistics
);

/**
 * ============================================
 * ADMIN ENDPOINTS (Authentication + Admin role required)
 * ============================================
 */

/**
 * POST /api/admin/programs
 * Create program
 * Body: { universityId, name, field, level, description, tuitionFee, ... }
 */
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  programValidators.create || [],
  handleValidationErrors,
  programController.createProgram
);

/**
 * PUT /api/admin/programs/:id
 * Update program
 * Params: id (MongoDB ObjectId)
 * Body: { name, field, description, ... }
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  programValidators.update || [],
  handleValidationErrors,
  programController.updateProgram
);

/**
 * DELETE /api/admin/programs/:id
 * Delete program
 * Params: id (MongoDB ObjectId)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  programValidators.delete || [],
  handleValidationErrors,
  programController.deleteProgram
);

/**
 * POST /api/admin/programs/bulk-import
 * Bulk import programs from CSV/JSON
 * Body: { programs: [{ name, universityId, field, ... }, ...] }
 */
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole('admin'),
  programValidators.bulkImport || [],
  handleValidationErrors,
  programController.bulkImportPrograms
);

module.exports = router;
