/**
 * Job Application Controller
 * Handles job applications from users and admin management
 */

const jobApplicationService = require('../services/jobApplicationService');

// ==================== USER ENDPOINTS ====================

// Apply for a job (Authenticated users)
const applyForJob = async (req, res, next) => {
  try {
    const { jobPostingId, cvUrl, coverLetterUrl, portfolioUrl, certificationsUrl } = req.body;
    const userId = req.user.id;

    const application = await jobApplicationService.applyForJob({
      jobPostingId,
      userId,
      cvUrl,
      coverLetterUrl,
      portfolioUrl,
      certificationsUrl,
    });

    return res.status(201).json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

// Get user's applications
const getUserApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await jobApplicationService.getUserApplications(userId, req.query);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// Get single application detail
const getApplicationDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const application = await jobApplicationService.getApplicationDetail(id, userId);
    return res.status(200).json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

// Withdraw application
const withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await jobApplicationService.withdrawApplication(id, userId);
    return res.status(200).json({ status: 'success', message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN ENDPOINTS ====================

// Get all applications (Admin)
const adminGetAllApplications = async (req, res, next) => {
  try {
    const result = await jobApplicationService.adminGetAllApplications(req.query);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// Get single application detail (Admin)
const adminGetApplicationDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await jobApplicationService.adminGetApplicationDetail(id);
    return res.status(200).json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

// Update application status and notes (Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const application = await jobApplicationService.updateApplicationStatus(id, updates);
    return res.status(200).json({ status: 'success', data: { application } });
  } catch (error) {
    next(error);
  }
};

// Delete application (Admin)
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await jobApplicationService.deleteApplication(id);
    return res.status(200).json({ status: 'success', message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get applications count by status (Admin)
const getApplicationStats = async (req, res, next) => {
  try {
    const stats = await jobApplicationService.getApplicationStats();
    return res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // User
  applyForJob,
  getUserApplications,
  getApplicationDetail,
  withdrawApplication,
  // Admin
  adminGetAllApplications,
  adminGetApplicationDetail,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
};
