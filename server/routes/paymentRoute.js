const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors, paymentValidators } = require('../validators');
const paymentController = require('../controllers/paymentController');

// Get Flutterwave public key and credentials for client-side payment
router.get('/credentials', paymentController.getCredentials);

// Create payment record (user authenticated)
router.post('/create', authenticateToken, paymentValidators.createPayment, handleValidationErrors, paymentController.create);

// Verify payment after Flutterwave transaction completes (client sends transactionId)
router.post('/verify', authenticateToken, paymentValidators.verifyPayment, handleValidationErrors, paymentController.verify);

// Get payment status by ID
router.get('/:paymentId/status', authenticateToken, handleValidationErrors, paymentController.status);

// User payment history
router.get('/history', authenticateToken, handleValidationErrors, paymentController.history);

// Get receipt for completed payment
router.get('/:paymentId/receipt', authenticateToken, handleValidationErrors, paymentController.getReceipt);

// Request refund for a payment
router.post('/:paymentId/refund', authenticateToken, handleValidationErrors, paymentController.requestRefund);

// Retry a failed payment
router.post('/:paymentId/retry', authenticateToken, handleValidationErrors, paymentController.retry);

// Webhook endpoint (Flutterwave will POST events here)
// note: no auth middleware, signature validated in controller
router.post('/webhook', paymentController.webhook);

module.exports = router;
