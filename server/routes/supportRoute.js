const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { professionalServiceValidators, handleValidationErrors } = require('../validators');
const supportController = require('../controllers/supportController');

// User endpoints
router.post('/ticket', authenticateToken, professionalServiceValidators.submitTicket, handleValidationErrors, supportController.createTicket);
router.get('/tickets', authenticateToken, handleValidationErrors, supportController.listTickets);
router.get('/ticket/:id', authenticateToken, handleValidationErrors, supportController.getTicket);
router.post('/ticket/:id/reply', authenticateToken, handleValidationErrors, supportController.replyToTicket);
router.put('/ticket/:id/priority', authenticateToken, handleValidationErrors, supportController.updatePriority);

// Admin endpoints
router.get('/admin/queue', authenticateToken, requireRole('admin'), handleValidationErrors, supportController.getTicketQueue);
router.post('/admin/ticket/:id/assign', authenticateToken, requireRole('admin'), handleValidationErrors, supportController.assignTicket);
router.post('/admin/ticket/:id/reply', authenticateToken, requireRole('admin'), handleValidationErrors, supportController.agentReply);
router.post('/admin/ticket/:id/resolve', authenticateToken, requireRole('admin'), handleValidationErrors, supportController.resolveTicket);
router.get('/admin/metrics', authenticateToken, requireRole('admin'), handleValidationErrors, supportController.getSLAMetrics);
router.get('/admin/sla-breaches', authenticateToken, requireRole('admin'), handleValidationErrors, supportController.checkSLABreaches);

module.exports = router;
