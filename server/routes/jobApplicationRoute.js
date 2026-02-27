/**
 * Job Application Routes
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const jobApplicationController = require('../controllers/jobApplicationController');

// ==================== USER ROUTES ====================
router.post('/apply', authenticateToken, jobApplicationController.applyForJob);

router.get('/my-applications', authenticateToken, jobApplicationController.getUserApplications);

router.get('/:id', authenticateToken, jobApplicationController.getApplicationDetail);

router.delete('/:id/withdraw', authenticateToken, jobApplicationController.withdrawApplication);

// ==================== ADMIN ROUTES ====================
router.get('/admin/all', authenticateToken, requireRole('admin'), jobApplicationController.adminGetAllApplications);

router.get('/admin/:id', authenticateToken, requireRole('admin'), jobApplicationController.adminGetApplicationDetail);

router.put('/admin/:id/status', authenticateToken, requireRole('admin'), jobApplicationController.updateApplicationStatus);

router.delete('/admin/:id', authenticateToken, requireRole('admin'), jobApplicationController.deleteApplication);

router.get('/admin/stats/overview', authenticateToken, requireRole('admin'), jobApplicationController.getApplicationStats);

module.exports = router;
