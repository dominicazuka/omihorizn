const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { professionalServiceValidators, handleValidationErrors } = require('../validators');
const coachingController = require('../controllers/coachingController');

// User endpoints
router.get('/available-slots', authenticateToken, handleValidationErrors, coachingController.availableSlots);
router.post('/book-session', authenticateToken, professionalServiceValidators.bookCoachingSession, handleValidationErrors, coachingController.bookSession);
router.get('/my-sessions', authenticateToken, handleValidationErrors, coachingController.mySessions);
router.get('/session/:sessionId/questions', authenticateToken, handleValidationErrors, coachingController.getInterviewQuestions);
router.post('/session/:sessionId/start', authenticateToken, handleValidationErrors, coachingController.startSession);
router.post('/session/:sessionId/complete', authenticateToken, handleValidationErrors, coachingController.completeSession);
router.get('/history', authenticateToken, handleValidationErrors, coachingController.getHistory);

// Admin endpoints (for coaches)
router.get('/admin/scheduled', authenticateToken, requireRole('admin'), handleValidationErrors, coachingController.getScheduledSessions);
router.post('/admin/:sessionId/feedback', authenticateToken, requireRole('admin'), handleValidationErrors, coachingController.submitFeedback);
router.post('/admin/:sessionId/recording', authenticateToken, requireRole('admin'), handleValidationErrors, coachingController.storeRecordingLink);

module.exports = router;
