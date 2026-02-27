const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../validators');
const subscriptionController = require('../controllers/subscriptionController');

// Create subscription (user)
router.post('/create', authenticateToken, handleValidationErrors, subscriptionController.create);

// Get current user's subscription
router.get('/me', authenticateToken, handleValidationErrors, subscriptionController.me);

// Get full subscription history for user
router.get('/history', authenticateToken, handleValidationErrors, subscriptionController.history);

// Get usage history for features
const { subscriptionValidators } = require('../validators');
router.get('/usage', authenticateToken, subscriptionValidators.getUsageHistory, handleValidationErrors, subscriptionController.usageHistory);

// Update subscription (admin or user with id)
router.put('/:subscriptionId', authenticateToken, handleValidationErrors, subscriptionController.update);

// Cancel subscription
router.post('/:subscriptionId/cancel', authenticateToken, handleValidationErrors, subscriptionController.cancel);

module.exports = router;
