/**
 * University Routes
 * All routes for university management (public and admin)
 * Validators imported from /server/validators/index.js
 */

const express = require('express');
const universityController = require('../controllers/universityController');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');
const { universityValidators, handleValidationErrors } = require('../validators/index');

const router = express.Router();

/**
 * ============================================
 * PUBLIC ENDPOINTS (No authentication required)
 * ============================================
 */

/**
 * GET /api/universities
 * List universities with pagination and filters
 * Query params: page, pageSize, country, region, search, sortBy, sortOrder
 */
router.get(
  '/',
  universityValidators.list,
  handleValidationErrors,
  universityController.listUniversities
);

/**
 * GET /api/universities/:id
 * Get university detail with programs
 * Params: id (MongoDB ObjectId)
 */
router.get(
  '/:id',
  universityValidators.getDetail,
  handleValidationErrors,
  universityController.getUniversityDetail
);

/**
 * POST /api/universities/:id/view
 * Increment view count (public tracking)
 * Params: id (MongoDB ObjectId)
 */
router.post(
  '/:id/view',
  universityValidators.incrementView,
  handleValidationErrors,
  universityController.incrementView
);

/**
 * GET /api/universities/search
 * Search universities by text and filters
 * Query params: q, country, region, minRanking, maxRanking, limit
 */
router.get(
  '/search',
  universityValidators.search,
  handleValidationErrors,
  universityController.searchUniversities
);

/**
 * POST /api/universities/compare
 * Compare multiple universities
 * Body: { universityIds: [id1, id2, ...] }
 */
router.post(
  '/compare',
  universityValidators.compare,
  handleValidationErrors,
  universityController.compareUniversities
);

/**
 * GET /api/universities/statistics
 * Get universities statistics
 */
router.get(
  '/stats',
  universityController.getStatistics
);

/**
 * ============================================
 * ADMIN ENDPOINTS (Authentication + Admin role required)
 * ============================================
 */

/**
 * POST /api/admin/universities
 * Create university
 * Body: { name, country, city, website, logo, description, qs_ranking, times_ranking, ... }
 */
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  universityValidators.create,
  handleValidationErrors,
  universityController.createUniversity
);

/**
 * PUT /api/admin/universities/:id
 * Update university
 * Params: id (MongoDB ObjectId)
 * Body: { name, country, description, ... }
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  universityValidators.update,
  handleValidationErrors,
  universityController.updateUniversity
);

/**
 * DELETE /api/admin/universities/:id
 * Delete university
 * Params: id (MongoDB ObjectId)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  universityValidators.delete,
  handleValidationErrors,
  universityController.deleteUniversity
);

/**
 * POST /api/admin/universities/bulk-import
 * Bulk import universities from CSV/JSON
 * Body: { universities: [{ name, country, city, ... }, ...] }
 */
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole('admin'),
  universityValidators.bulkImport,
  handleValidationErrors,
  universityController.bulkImportUniversities
);

module.exports = router;
