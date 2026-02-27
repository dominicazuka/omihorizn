const express = require('express');
const router = express.Router();
const visaDataController = require('../controllers/visaDataController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { visaDataValidators } = require('../validators');
const { handleValidationErrors } = require('../middleware/validation');

// public GET endpoints
router.get(
  '/requirements/:country/:visaType?',
  visaDataValidators.getRequirements,
  handleValidationErrors,
  visaDataController.getRequirements
);
router.get(
  '/pathways/:country',
  visaDataValidators.getPathways,
  handleValidationErrors,
  visaDataController.getPathways
);
router.get(
  '/labour-shortages/:country',
  visaDataValidators.getLabourShortages,
  handleValidationErrors,
  visaDataController.getLabourShortages
);

// admin CRUD
router.post(
  '/admin/visa-data',
  authenticateToken,
  requireRole('admin'),
  visaDataValidators.adminCreate,
  handleValidationErrors,
  visaDataController.createVisaData
);
router.put(
  '/admin/visa-data/:id',
  authenticateToken,
  requireRole('admin'),
  visaDataValidators.adminUpdate,
  handleValidationErrors,
  visaDataController.updateVisaData
);
router.delete(
  '/admin/visa-data/:id',
  authenticateToken,
  requireRole('admin'),
  visaDataValidators.adminUpdate,
  handleValidationErrors,
  visaDataController.deleteVisaData
);

module.exports = router;
