/**
 * Job Posting Controller
 * Handles admin job posting management and public job listing
 */

const jobPostingService = require('../services/jobPostingService');
const jobApplicationService = require('../services/jobApplicationService');
const { AppError } = require('../middleware/errorHandler');

// ==================== ADMIN ENDPOINTS ====================

// Create job posting (Admin only)
const createJobPosting = async (req, res, next) => {
  try {
    const data = req.body;
    const jobPosting = await jobPostingService.createJobPosting(data, req.user.id);
    return res.status(201).json({ status: 'success', data: { jobPosting } });
  } catch (error) {
    next(error);
  }
};

// Get all job postings (Admin view - includes all statuses)
const adminGetAllJobPostings = async (req, res, next) => {
  try {
    const result = await jobPostingService.getAllJobPostings(req.query);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// Get single job posting detail (Admin)
const adminGetJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobPosting = await jobPostingService.getJobPostingById(id);
    return res.status(200).json({ status: 'success', data: { jobPosting } });
  } catch (error) {
    next(error);
  }
};

// Update job posting (Admin only)
const updateJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const jobPosting = await jobPostingService.updateJobPosting(id, updates);
    return res.status(200).json({ status: 'success', data: { jobPosting } });
  } catch (error) {
    next(error);
  }
};

// Delete job posting (Admin only)
const deleteJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params;
    await jobPostingService.deleteJobPosting(id);
    return res.status(200).json({ status: 'success', message: 'Job posting and associated applications deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get applications for specific job (Admin)
const getJobApplications = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await jobPostingService.getJobApplications(id, req.query);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// ==================== PUBLIC ENDPOINTS ====================

// Get all active job postings (Public)
const getPublicJobPostings = async (req, res, next) => {
  try {
    const result = await jobPostingService.getPublicJobPostings(req.query);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// Get single job posting detail (Public)
const getPublicJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Increment view count and fetch
    const jobPosting = await jobPostingService.trackJobView(id);

    if (!jobPosting || jobPosting.status === 'archived') {
      throw new AppError('Job posting not found', 404);
    }

    // Check if user already applied
    let hasApplied = false;
    if (req.user) {
      const app = await jobApplicationService.getUserApplications(req.user.id, { jobPostingId: id, page: 1, limit: 1 });
      hasApplied = (app && app.applications && app.applications.length > 0) || false;
    }

    return res.status(200).json({ status: 'success', data: { jobPosting, hasApplied } });
  } catch (error) {
    next(error);
  }
};

// Track job view (Public)
const trackJobView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobPosting = await jobPostingService.trackJobView(id);
    return res.status(200).json({ status: 'success', data: { viewCount: jobPosting.viewCount } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Admin
  createJobPosting,
  adminGetAllJobPostings,
  adminGetJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobApplications,
  // Public
  getPublicJobPostings,
  getPublicJobPosting,
  trackJobView,
};
