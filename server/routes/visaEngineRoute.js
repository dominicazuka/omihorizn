const express = require('express');
const router = express.Router();
const visaEngineController = require('../controllers/visaEngineController');
const { authenticateToken } = require('../middleware/auth');
const { visaEngineValidators } = require('../validators');
const { handleValidationErrors } = require('../middleware/validation');

// all engines require authentication
router.post(
  '/skill-match',
  authenticateToken,
  visaEngineValidators.skillMatch,
  handleValidationErrors,
  visaEngineController.skillMatch
);

router.post(
  '/feasibility',
  authenticateToken,
  visaEngineValidators.feasibility,
  handleValidationErrors,
  visaEngineController.feasibility
);

router.post(
  '/pr-pathway',
  authenticateToken,
  visaEngineValidators.prPathway,
  handleValidationErrors,
  visaEngineController.prPathway
);

module.exports = router;
