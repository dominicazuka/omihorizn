/**
 * Job Application Service
 * Business logic for applying to jobs and admin application management
 */

const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const applyForJob = async ({ jobPostingId, userId, cvUrl, coverLetterUrl, portfolioUrl, certificationsUrl }) => {
  const jobPosting = await JobPosting.findById(jobPostingId);
  if (!jobPosting) throw new AppError('Job posting not found', 404);

  const existing = await JobApplication.findOne({ jobPostingId, userId });
  if (existing) throw new AppError('User already applied for this job', 400);

  if (new Date() > new Date(jobPosting.applicationDeadline)) throw new AppError('Application deadline passed', 400);

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const application = await JobApplication.create({
    jobPostingId,
    userId,
    cvUrl,
    coverLetterUrl: coverLetterUrl || null,
    portfolioUrl: portfolioUrl || null,
    certificationsUrl: certificationsUrl || [],
    applicantName: `${user.firstName} ${user.lastName}`,
    applicantEmail: user.email,
    applicantPhone: user.phone,
  });

  await JobPosting.findByIdAndUpdate(jobPostingId, { $inc: { applicationCount: 1 } });

  return application;
};

const getUserApplications = async (userId, query = {}) => {
  const { page = 1, limit = 20, status, sort = '-appliedAt' } = query;
  const filter = { userId };
  if (status) filter.status = status;

  const total = await JobApplication.countDocuments(filter);
  const applications = await JobApplication.find(filter)
    .populate('jobPostingId', 'title companyName location category salaryMin salaryMax')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return { applications, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const getApplicationDetail = async (id, userId) => {
  const application = await JobApplication.findOne({ _id: id, userId }).populate('jobPostingId').populate('userId', 'firstName lastName email phone');
  if (!application) throw new AppError('Application not found', 404);
  return application;
};

const withdrawApplication = async (id, userId) => {
  const application = await JobApplication.findOneAndDelete({ _id: id, userId });
  if (!application) throw new AppError('Application not found', 404);
  await JobPosting.findByIdAndUpdate(application.jobPostingId, { $inc: { applicationCount: -1 } });
  return application;
};

// Admin methods
const adminGetAllApplications = async (query = {}) => {
  const { page = 1, limit = 20, status, jobPostingId, search, sort = '-appliedAt' } = query;
  const filter = {};
  if (status) filter.status = status;
  if (jobPostingId) filter.jobPostingId = jobPostingId;
  if (search) filter.$or = [{ applicantName: new RegExp(search, 'i') }, { applicantEmail: new RegExp(search, 'i') }];

  const total = await JobApplication.countDocuments(filter);
  const applications = await JobApplication.find(filter)
    .populate('jobPostingId', 'title companyName')
    .populate('userId', 'firstName lastName email')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return { applications, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const adminGetApplicationDetail = async (id) => {
  const application = await JobApplication.findById(id).populate('jobPostingId').populate('userId', 'firstName lastName email phone');
  if (!application) throw new AppError('Application not found', 404);
  return application;
};

const updateApplicationStatus = async (id, updates) => {
  const application = await JobApplication.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!application) throw new AppError('Application not found', 404);
  return application;
};

const deleteApplication = async (id) => {
  const application = await JobApplication.findByIdAndDelete(id);
  if (!application) throw new AppError('Application not found', 404);
  await JobPosting.findByIdAndUpdate(application.jobPostingId, { $inc: { applicationCount: -1 } });
  return application;
};

const getApplicationStats = async () => {
  const total = await JobApplication.countDocuments();
  const byStatus = await JobApplication.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  return { total, byStatus };
};

module.exports = {
  applyForJob,
  getUserApplications,
  getApplicationDetail,
  withdrawApplication,
  adminGetAllApplications,
  adminGetApplicationDetail,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
};
