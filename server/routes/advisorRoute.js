const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { professionalServiceValidators, handleValidationErrors } = require('../validators');
const advisorController = require('../controllers/advisorController');

// List available advisor slots
router.get('/available-slots', authenticateToken, handleValidationErrors, advisorController.availableSlots);

// Get advisor profile
router.get('/profile/:advisorId', authenticateToken, handleValidationErrors, advisorController.getAdvisorProfile);

// Book advisor call
router.post('/book-call', authenticateToken, professionalServiceValidators.bookAdvisor, handleValidationErrors, advisorController.bookCall);

// Get user's scheduled calls
router.get('/my-calls', authenticateToken, handleValidationErrors, advisorController.getMyCalls);

// Reschedule a call
router.put('/call/:callId/reschedule', authenticateToken, handleValidationErrors, advisorController.rescheduleCall);

// Add pre-call notes and topics
router.post('/call/:callId/notes', authenticateToken, handleValidationErrors, advisorController.addCallNotes);

// Mark call complete with feedback
router.post('/call/:callId/complete', authenticateToken, handleValidationErrors, advisorController.completeCall);

// Get call history
router.get('/call-history', authenticateToken, handleValidationErrors, advisorController.getCallHistory);

module.exports = router;
