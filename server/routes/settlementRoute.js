const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlementController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { settlementValidators } = require('../validators');
const { handleValidationErrors } = require('../middleware/validation');

router.get(
  '/:country/resources',
  settlementValidators.getResources,
  handleValidationErrors,
  settlementController.getResources
);
router.get(
  '/:country/pr-timeline',
  settlementValidators.getPRTimeline,
  handleValidationErrors,
  settlementController.getPRTimeline
);
router.get(
  '/:country/schengen-access',
  settlementValidators.getSchengen,
  handleValidationErrors,
  settlementController.getSchengen
);
router.post(
  '/:country/job-market-analysis',
  settlementValidators.jobMarketAnalysis,
  handleValidationErrors,
  settlementController.jobMarketAnalysis
);

// admin resource management
router.post(
  '/admin/resource',
  authenticateToken,
  requireRole('admin'),
  settlementValidators.adminCreate,
  handleValidationErrors,
  settlementController.createResource
);
router.put(
  '/admin/resource/:id',
  authenticateToken,
  requireRole('admin'),
  settlementValidators.adminUpdate,
  handleValidationErrors,
  settlementController.updateResource
);
router.delete(
  '/admin/resource/:id',
  authenticateToken,
  requireRole('admin'),
  settlementValidators.adminUpdate,
  handleValidationErrors,
  settlementController.deleteResource
);

module.exports = router;
