const express = require('express');
const router = express.Router();
const postAcceptanceController = require('../controllers/postAcceptanceController');
const { authenticateToken } = require('../middleware/auth');
const { postAcceptanceValidators } = require('../validators');
const { handleValidationErrors } = require('../middleware/validation');

router.post(
  '/applications/:appId/checklist',
  authenticateToken,
  postAcceptanceValidators.initChecklist,
  handleValidationErrors,
  postAcceptanceController.initChecklist
);
router.get(
  '/applications/:appId/checklist',
  authenticateToken,
  postAcceptanceValidators.getChecklist,
  handleValidationErrors,
  postAcceptanceController.getChecklist
);
router.put(
  '/applications/:appId/checklist/:itemId',
  authenticateToken,
  postAcceptanceValidators.markItem,
  handleValidationErrors,
  postAcceptanceController.markItem
);

router.get(
  '/settlement/:country/accommodation',
  postAcceptanceValidators.getAccommodation,
  handleValidationErrors,
  postAcceptanceController.getAccommodation
);
router.get(
  '/settlement/:country/student-life',
  postAcceptanceValidators.getStudentLife,
  handleValidationErrors,
  postAcceptanceController.getStudentLife
);
router.get(
  '/settlement/:country/pre-arrival',
  postAcceptanceValidators.getPreArrival,
  handleValidationErrors,
  postAcceptanceController.getPreArrival
);
router.post(
  '/settlement/cost-estimate',
  postAcceptanceValidators.costEstimate,
  handleValidationErrors,
  postAcceptanceController.costEstimate
);

module.exports = router;
