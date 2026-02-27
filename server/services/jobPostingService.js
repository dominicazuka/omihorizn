/**
 * Job Posting Service
 * Business logic for job postings and public listing
 */

const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const { AppError } = require('../middleware/errorHandler');

const createJobPosting = async (data, createdBy) => {
  const jobPosting = await JobPosting.create({ ...data, createdBy });
  return jobPosting;
};

const getAllJobPostings = async (query = {}) => {
  const { page = 1, limit = 20, status, category, country, sort = '-createdAt' } = query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (country) filter.country = country;

  const total = await JobPosting.countDocuments(filter);
  const jobPostings = await JobPosting.find(filter)
    .populate('createdBy', 'firstName lastName email')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return { jobPostings, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const getJobPostingById = async (id) => {
  const jobPosting = await JobPosting.findById(id).populate('createdBy', 'firstName lastName email');
  if (!jobPosting) throw new AppError('Job posting not found', 404);
  return jobPosting;
};

const updateJobPosting = async (id, updates) => {
  // Prevent admin-updated counters
  delete updates.viewCount;
  delete updates.applicationCount;
  delete updates.createdBy;

  const jobPosting = await JobPosting.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!jobPosting) throw new AppError('Job posting not found', 404);
  return jobPosting;
};

const deleteJobPosting = async (id) => {
  const jobPosting = await JobPosting.findByIdAndDelete(id);
  if (!jobPosting) throw new AppError('Job posting not found', 404);
  // remove related applications
  await JobApplication.deleteMany({ jobPostingId: id });
  return jobPosting;
};

const getJobApplications = async (jobId, query = {}) => {
  const { page = 1, limit = 20, search, status, sort = '-appliedAt' } = query;
  const filter = { jobPostingId: jobId };
  if (status) filter.status = status;
  if (search) filter.$or = [ { applicantName: new RegExp(search, 'i') }, { applicantEmail: new RegExp(search, 'i') } ];

  const total = await JobApplication.countDocuments(filter);
  const applications = await JobApplication.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return { applications, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const getPublicJobPostings = async (query = {}) => {
  const { page = 1, limit = 20, q, category, country, city, experienceLevel, sort = '-createdAt' } = query;
  const filter = { status: 'active' };
  if (category) filter.category = category;
  if (country) filter.country = country;
  if (city) filter.city = city;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (q) filter.title = new RegExp(q, 'i');

  const total = await JobPosting.countDocuments(filter);
  const jobPostings = await JobPosting.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return { jobPostings, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const getPublicJobPosting = async (id) => {
  const jobPosting = await JobPosting.findOne({ _id: id, status: 'active' });
  if (!jobPosting) throw new AppError('Job posting not found', 404);
  return jobPosting;
};

const trackJobView = async (id) => {
  const jobPosting = await JobPosting.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
  if (!jobPosting) throw new AppError('Job posting not found', 404);
  return jobPosting;
};

module.exports = {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
  getJobApplications,
  getPublicJobPostings,
  getPublicJobPosting,
  trackJobView,
};
