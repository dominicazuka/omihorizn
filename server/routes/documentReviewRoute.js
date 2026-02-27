const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { professionalServiceValidators, handleValidationErrors } = require('../validators');
const reviewController = require('../controllers/documentReviewController');

// User endpoints
router.post('/document-review', authenticateToken, professionalServiceValidators.submitDocumentReview, handleValidationErrors, reviewController.submitReview);
router.get('/status/:reviewId', authenticateToken, handleValidationErrors, reviewController.status);
router.get('/my-reviews', authenticateToken, handleValidationErrors, reviewController.myReviews);
router.get('/:reviewId/document', authenticateToken, handleValidationErrors, reviewController.downloadReviewedDocument);
router.post('/:reviewId/request-revision', authenticateToken, handleValidationErrors, reviewController.requestRevision);
router.put('/:reviewId/resubmit', authenticateToken, handleValidationErrors, reviewController.resubmitDocument);

// Admin endpoints (for advisors/admins)
router.get('/admin/pending', authenticateToken, requireRole('admin'), handleValidationErrors, reviewController.getPendingReviews);
router.post('/admin/:reviewId/complete', authenticateToken, requireRole('admin'), handleValidationErrors, reviewController.completeReview);
router.post('/admin/:reviewId/feedback', authenticateToken, requireRole('admin'), handleValidationErrors, reviewController.addFeedback);

module.exports = router;
