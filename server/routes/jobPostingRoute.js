/**
 * Job Posting Routes
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const jobPostingController = require('../controllers/jobPostingController');

// ==================== ADMIN ROUTES ====================
router.post('/admin/jobs', authenticateToken, requireRole('admin'), jobPostingController.createJobPosting);

router.get('/admin/jobs', authenticateToken, requireRole('admin'), jobPostingController.adminGetAllJobPostings);

router.get('/admin/jobs/:id', authenticateToken, requireRole('admin'), jobPostingController.adminGetJobPosting);

router.put('/admin/jobs/:id', authenticateToken, requireRole('admin'), jobPostingController.updateJobPosting);

router.delete('/admin/jobs/:id', authenticateToken, requireRole('admin'), jobPostingController.deleteJobPosting);

router.get('/admin/jobs/:id/applications', authenticateToken, requireRole('admin'), jobPostingController.getJobApplications);

// ==================== PUBLIC ROUTES ====================

// Get all active job postings (public)
router.get('/', jobPostingController.getPublicJobPostings);

// Get single job posting detail (public)
router.get('/:id', jobPostingController.getPublicJobPosting);

// Track job view
router.post('/:id/view', jobPostingController.trackJobView);

module.exports = router;
