/**
 * Country Routes
 * All routes for country and visa information management
 * Validators imported from /server/validators/index.js
 */

const express = require('express');
const countryController = require('../controllers/countryController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { countryValidators, handleValidationErrors } = require('../validators/index');

const router = express.Router();

/**
 * ============================================
 * PUBLIC ENDPOINTS (No authentication required)
 * ============================================
 */

/**
 * GET /api/countries
 * List countries with pagination and filters
 * Query params: page, pageSize, region, search
 */
router.get(
  '/',
  countryValidators.list || [],
  handleValidationErrors,
  countryController.listCountries
);

/**
 * GET /api/countries/:id
 * Get country detail with visa information
 * Params: id (MongoDB ObjectId or country code)
 */
router.get(
  '/:id',
  countryValidators.getDetail || [],
  handleValidationErrors,
  countryController.getCountryDetail
);

/**
 * GET /api/countries/region/:region
 * Get countries by region
 * Params: region (region name)
 */
router.get(
  '/region/:region',
  countryController.getCountriesByRegion
);

/**
 * GET /api/countries/:id/visa-guide
 * Get visa guide for a country
 * Params: id (MongoDB ObjectId or country code)
 */
router.get(
  '/:id/visa-guide',
  countryController.getVisaGuide
);

/**
 * GET /api/countries/:id/visa-requirements
 * Get visa requirements by nationality
 * Params: id (MongoDB ObjectId or country code)
 * Query params: nationality (country code)
 */
router.get(
  '/:id/visa-requirements',
  countryController.getVisaRequirements
);

/**
 * GET /api/countries/:id/cost-of-living
 * Get cost of living for a country
 * Params: id (MongoDB ObjectId or country code)
 */
router.get(
  '/:id/cost-of-living',
  countryController.getCostOfLiving
);

/**
 * GET /api/countries/:id/education-system
 * Get education system information
 * Params: id (MongoDB ObjectId or country code)
 */
router.get(
  '/:id/education-system',
  countryController.getEducationSystem
);

/**
 * GET /api/countries/search
 * Search countries by text
 * Query params: q (search query)
 */
router.get(
  '/search',
  countryValidators.search || [],
  handleValidationErrors,
  countryController.searchCountries
);

/**
 * GET /api/countries/statistics
 * Get countries statistics
 */
router.get(
  '/stats',
  countryController.getStatistics
);

/**
 * ============================================
 * ADMIN ENDPOINTS (Authentication + Admin role required)
 * ============================================
 */

/**
 * POST /api/admin/countries
 * Create country
 * Body: { name, code, region, description, visaTypes, ... }
 */
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  countryValidators.create || [],
  handleValidationErrors,
  countryController.createCountry
);

/**
 * PUT /api/admin/countries/:id
 * Update country
 * Params: id (MongoDB ObjectId)
 * Body: { name, description, visaTypes, ... }
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  countryValidators.update || [],
  handleValidationErrors,
  countryController.updateCountry
);

/**
 * DELETE /api/admin/countries/:id
 * Delete country
 * Params: id (MongoDB ObjectId)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  countryValidators.delete || [],
  handleValidationErrors,
  countryController.deleteCountry
);

/**
 * POST /api/admin/countries/bulk-import
 * Bulk import countries from CSV/JSON
 * Body: { countries: [{ name, code, region, ... }, ...] }
 */
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole('admin'),
  countryValidators.bulkImport || [],
  handleValidationErrors,
  countryController.bulkImportCountries
);

module.exports = router;
