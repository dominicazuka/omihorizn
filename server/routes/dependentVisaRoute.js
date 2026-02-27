const express = require('express');
const router = express.Router();
const dependentVisaController = require('../controllers/dependentVisaController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { dependentVisaValidators } = require('../validators');
const { handleValidationErrors } = require('../middleware/validation');

router.get(
  '/dependent/:country/:visaType',
  dependentVisaValidators.getDependent,
  handleValidationErrors,
  dependentVisaController.getDependent
);
router.get(
  '/family-relocation/:country',
  dependentVisaValidators.getFamilyRelocation,
  handleValidationErrors,
  dependentVisaController.getFamilyRelocation
);
router.post(
  '/family-cost-estimate',
  dependentVisaValidators.familyCostEstimate,
  handleValidationErrors,
  dependentVisaController.familyCostEstimate
);

// admin CRUD
router.post(
  '/admin/dependent-visa',
  authenticateToken,
  requireRole('admin'),
  dependentVisaValidators.adminCreate,
  handleValidationErrors,
  dependentVisaController.createEntry
);
router.put(
  '/admin/dependent-visa/:id',
  authenticateToken,
  requireRole('admin'),
  dependentVisaValidators.adminUpdate,
  handleValidationErrors,
  dependentVisaController.updateEntry
);
router.delete(
  '/admin/dependent-visa/:id',
  authenticateToken,
  requireRole('admin'),
  dependentVisaValidators.adminUpdate,
  handleValidationErrors,
  dependentVisaController.deleteEntry
);

module.exports = router;
