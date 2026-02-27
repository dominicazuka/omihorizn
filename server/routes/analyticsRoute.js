const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// All analytics endpoints require admin authentication
router.use(authenticateToken, requireRole('admin'));

// Get comprehensive dashboard analytics (30 days by default, customizable)
router.get('/dashboard', analyticsController.getDashboard);

// Get payment-specific analytics
router.get('/payments', analyticsController.getPaymentAnalytics);

// Get subscription-specific analytics
router.get('/subscriptions', analyticsController.getSubscriptionAnalytics);

// Get user-specific analytics
router.get('/users', analyticsController.getUserAnalytics);

// Get professional services analytics (advisor, coaching, document review)
router.get('/professional-services', analyticsController.getProfessionalServicesAnalytics);

// Get support ticket analytics
router.get('/support', analyticsController.getSupportAnalytics);

module.exports = router;
