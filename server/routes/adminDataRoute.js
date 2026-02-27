const express = require('express');
const router = express.Router();
const adminDataController = require('../controllers/adminDataController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { adminDataValidators } = require('../validators');
const { handleValidationErrors } = require('../middleware/validation');

router.post(
  '/import/:model',
  authenticateToken,
  requireRole('admin'),
  adminDataValidators.import,
  handleValidationErrors,
  adminDataController.importData
);

router.get(
  '/export/:model',
  authenticateToken,
  requireRole('admin'),
  adminDataValidators.export,
  handleValidationErrors,
  adminDataController.exportData
);

module.exports = router;
