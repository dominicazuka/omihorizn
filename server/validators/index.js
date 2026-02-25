/**
 * Centralized Validators Index
 * All validation rules and functions are defined here and exported for use across the server
 * This file serves as the single source of truth for input validation
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * ============================================
 * VALIDATION RULES
 * ============================================
 */

// ============ AUTHENTICATION ============
const authValidators = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Valid phone number is required'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
  ],

  resetPassword: [
    param('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ],

  verifyEmail: [
    body('token')
      .notEmpty()
      .withMessage('Verification token is required'),
  ],

  verifyRole: [
    // JWT token validation is done by middleware
  ],

  twoFAVerify: [
    body('otpCode')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP code must be 6 digits'),
  ],
};

// ============ USER PROFILE ============
const userValidators = {
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Valid phone number is required'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must be max 500 characters'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Address must be max 200 characters'),
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ],

  addEducation: [
    body('degree')
      .trim()
      .notEmpty()
      .withMessage('Degree is required'),
    body('field')
      .trim()
      .notEmpty()
      .withMessage('Field of study is required'),
    body('university')
      .trim()
      .notEmpty()
      .withMessage('University name is required'),
    body('gpa')
      .optional()
      .isFloat({ min: 0, max: 5.0 })
      .withMessage('GPA must be between 0 and 5.0'),
    body('completionYear')
      .optional()
      .isInt({ min: 1900, max: 2100 })
      .withMessage('Valid completion year is required'),
  ],

  updatePreferences: [
    body('language')
      .optional()
      .isIn(['en', 'es', 'fr', 'de', 'pt'])
      .withMessage('Invalid language'),
    body('timezone')
      .optional()
      .notEmpty()
      .withMessage('Timezone is required'),
    body('emailNotifications')
      .optional()
      .isBoolean()
      .withMessage('Must be boolean'),
    body('quietHoursStart')
      .optional()
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Must be in HH:MM format'),
    body('quietHoursEnd')
      .optional()
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Must be in HH:MM format'),
  ],
};

// ============ APPLICATIONS ============
const applicationValidators = {
  create: [
    body('universityId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid university ID is required'),
    body('programId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid program ID is required'),
    body('status')
      .optional()
      .isIn(['draft', 'submitted', 'accepted', 'rejected', 'pending'])
      .withMessage('Invalid status'),
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Valid application ID is required'),
    body('status')
      .optional()
      .isIn(['draft', 'submitted', 'accepted', 'rejected', 'pending'])
      .withMessage('Invalid status'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Notes must be max 2000 characters'),
    body('deadline')
      .optional()
      .isISO8601()
      .withMessage('Valid deadline date is required'),
  ],

  delete: [
    param('id')
      .isMongoId()
      .withMessage('Valid application ID is required'),
  ],

  listWithPagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['draft', 'submitted', 'accepted', 'rejected', 'pending'])
      .withMessage('Invalid status'),
    query('sort')
      .optional()
      .isIn(['createdAt', 'deadline', 'status'])
      .withMessage('Invalid sort field'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Invalid sort order'),
  ],
};

// ============ DOCUMENTS ============
const documentValidators = {
  upload: [
    body('applicationId')
      .optional()
      .isMongoId()
      .withMessage('Valid application ID is required'),
    body('type')
      .trim()
      .notEmpty()
      .isIn(['sop', 'cv', 'cover-letter', 'transcript', 'ielts', 'gre', 'gmat', 'other'])
      .withMessage('Valid document type is required'),
    body('s3Url')
      .isURL()
      .withMessage('Valid S3 URL is required'),
  ],

  presignedUrl: [
    query('type')
      .notEmpty()
      .isIn(['document', 'blog', 'profile', 'university'])
      .withMessage('Valid file type is required'),
    query('filename')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Filename must not be empty'),
  ],

  delete: [
    param('id')
      .isMongoId()
      .withMessage('Valid document ID is required'),
  ],

  listWithPagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('type')
      .optional()
      .isIn(['sop', 'cv', 'cover-letter', 'transcript', 'ielts', 'gre', 'gmat', 'other'])
      .withMessage('Invalid document type'),
    query('applicationId')
      .optional()
      .isMongoId()
      .withMessage('Valid application ID is required'),
  ],
};

// ============ PAYMENTS & SUBSCRIPTIONS ============
const paymentValidators = {
  subscribe: [
    body('planId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid plan ID is required'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Valid amount is required'),
  ],

  webhook: [
    body('status')
      .notEmpty()
      .isIn(['successful', 'pending', 'failed', 'cancelled'])
      .withMessage('Valid status is required'),
    body('transaction_id')
      .notEmpty()
      .withMessage('Transaction ID is required'),
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Valid amount is required'),
  ],

  updateSubscription: [
    param('subscriptionId')
      .isMongoId()
      .withMessage('Valid subscription ID is required'),
    body('tier')
      .notEmpty()
      .isIn(['free', 'basic', 'professional'])
      .withMessage('Valid subscription tier is required'),
  ],

  cancelSubscription: [
    param('subscriptionId')
      .isMongoId()
      .withMessage('Valid subscription ID is required'),
  ],

  getUsageHistory: [
    query('feature')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Feature name must not be empty'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
  ],
};

// ============ UNIVERSITIES & PROGRAMS ============
const universityValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .withMessage('University name must be between 2 and 200 characters'),
    body('country')
      .trim()
      .notEmpty()
      .withMessage('Country is required'),
    body('city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    body('ranking')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Ranking must be a positive integer'),
    body('website')
      .optional()
      .isURL()
      .withMessage('Valid website URL is required'),
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Valid university ID is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('University name must be between 2 and 200 characters'),
  ],

  search: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
    query('country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Country must not be empty'),
    query('ranking')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Ranking must be a positive integer'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
  ],
};

const programValidators = {
  create: [
    body('universityId')
      .isMongoId()
      .withMessage('Valid university ID is required'),
    body('name')
      .trim()
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .withMessage('Program name must be between 2 and 200 characters'),
    body('fieldOfStudy')
      .trim()
      .notEmpty()
      .withMessage('Field of study is required'),
    body('degree')
      .trim()
      .notEmpty()
      .isIn(['bachelor', 'master', 'phd'])
      .withMessage('Valid degree level is required'),
    body('tuitionFeeMin')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid tuition fee is required'),
    body('applicationDeadline')
      .optional()
      .isISO8601()
      .withMessage('Valid application deadline is required'),
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Valid program ID is required'),
  ],
};

// ============ CAREERS & JOB POSTINGS ============
const jobValidators = {
  createJob: [
    body('title')
      .trim()
      .notEmpty()
      .isLength({ min: 3, max: 200 })
      .withMessage('Job title must be between 3 and 200 characters'),
    body('company')
      .trim()
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .withMessage('Company name must be between 2 and 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be between 10 and 5000 characters'),
    body('location')
      .trim()
      .notEmpty()
      .withMessage('Location is required'),
    body('category')
      .trim()
      .notEmpty()
      .isIn(['tech', 'finance', 'healthcare', 'education', 'other'])
      .withMessage('Valid job category is required'),
    body('experienceLevel')
      .notEmpty()
      .isIn(['junior', 'mid', 'senior'])
      .withMessage('Valid experience level is required'),
    body('employmentType')
      .notEmpty()
      .isIn(['full-time', 'part-time', 'contract', 'internship'])
      .withMessage('Valid employment type is required'),
    body('salaryMin')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid minimum salary is required'),
    body('salaryMax')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid maximum salary is required'),
    body('applicationDeadline')
      .isISO8601()
      .withMessage('Valid application deadline is required'),
    body('requiredSkills')
      .optional()
      .isArray()
      .withMessage('Required skills must be an array'),
  ],

  updateJob: [
    param('id')
      .isMongoId()
      .withMessage('Valid job ID is required'),
  ],

  listJobs: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
    query('category')
      .optional()
      .isIn(['tech', 'finance', 'healthcare', 'education', 'other'])
      .withMessage('Invalid job category'),
    query('experience')
      .optional()
      .isIn(['junior', 'mid', 'senior'])
      .withMessage('Invalid experience level'),
    query('employmentType')
      .optional()
      .isIn(['full-time', 'part-time', 'contract', 'internship'])
      .withMessage('Invalid employment type'),
    query('salaryMin')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid minimum salary is required'),
    query('salaryMax')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid maximum salary is required'),
    query('sort')
      .optional()
      .isIn(['newest', 'oldest', 'salary-high', 'salary-low', 'deadline'])
      .withMessage('Invalid sort option'),
  ],

  applyJob: [
    param('jobId')
      .isMongoId()
      .withMessage('Valid job ID is required'),
    body('cvUrl')
      .isURL()
      .withMessage('Valid CV URL is required'),
    body('coverLetterUrl')
      .optional()
      .isURL()
      .withMessage('Valid cover letter URL is required'),
  ],

  listApplications: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('jobId')
      .optional()
      .isMongoId()
      .withMessage('Valid job ID is required'),
    query('status')
      .optional()
      .isIn(['pending', 'shortlisted', 'rejected', 'hired'])
      .withMessage('Invalid status'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
  ],
};

// ============ BLOG POSTS ============
const blogValidators = {
  createBlog: [
    body('title')
      .trim()
      .notEmpty()
      .isLength({ min: 3, max: 200 })
      .withMessage('Blog title must be between 3 and 200 characters'),
    body('content')
      .trim()
      .notEmpty()
      .isLength({ min: 50, max: 50000 })
      .withMessage('Content must be between 50 and 50000 characters'),
    body('category')
      .trim()
      .notEmpty()
      .isIn(['visa-guides', 'study-abroad', 'immigration-news', 'career-tips', 'other'])
      .withMessage('Valid blog category is required'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('featuredImageUrl')
      .optional()
      .isURL()
      .withMessage('Valid featured image URL is required'),
    body('metaDescription')
      .optional()
      .trim()
      .isLength({ max: 160 })
      .withMessage('Meta description must be max 160 characters'),
    body('status')
      .optional()
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Invalid status'),
    body('publishDate')
      .optional()
      .isISO8601()
      .withMessage('Valid publish date is required'),
  ],

  updateBlog: [
    param('id')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
  ],

  listBlogs: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
    query('category')
      .optional()
      .isIn(['visa-guides', 'study-abroad', 'immigration-news', 'career-tips', 'other'])
      .withMessage('Invalid blog category'),
    query('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    query('status')
      .optional()
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Invalid status'),
    query('sort')
      .optional()
      .isIn(['newest', 'oldest', 'trending', 'most-viewed'])
      .withMessage('Invalid sort option'),
  ],

  getBlogBySlug: [
    param('slug')
      .trim()
      .notEmpty()
      .withMessage('Valid blog slug is required'),
  ],
};

// ============ BLOG COMMENTS ============
const blogCommentValidators = {
  createComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment content is required')
      .isLength({ min: 1, max: 5000 })
      .withMessage('Comment must be between 1 and 5000 characters')
      .custom(value => {
        // Reject whitespace-only comments
        if (!value || value.trim().length === 0) {
          throw new Error('Comment cannot be empty or whitespace-only');
        }
        return true;
      })
      .custom(value => {
        // Reject comments with only URLs (spam filter)
        const urlRegex = /^(https?:\/\/[^\s]+\s*)+$/;
        if (urlRegex.test(value)) {
          throw new Error('Comment cannot contain only URLs');
        }
        return true;
      }),
    body('parentCommentId')
      .optional()
      .isMongoId()
      .withMessage('Valid parent comment ID is required'),
  ],

  listComments: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Page size must be between 1 and 50'),
    query('sort')
      .optional()
      .isIn(['newest', 'oldest', 'most-liked'])
      .withMessage('Invalid sort option'),
  ],

  updateComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    param('commentId')
      .isMongoId()
      .withMessage('Valid comment ID is required'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment content is required')
      .isLength({ min: 1, max: 5000 })
      .withMessage('Comment must be between 1 and 5000 characters')
      .custom(value => {
        if (!value || value.trim().length === 0) {
          throw new Error('Comment cannot be empty or whitespace-only');
        }
        return true;
      }),
  ],

  deleteComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    param('commentId')
      .isMongoId()
      .withMessage('Valid comment ID is required'),
  ],

  likeComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    param('commentId')
      .isMongoId()
      .withMessage('Valid comment ID is required'),
  ],

  replyToComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    param('commentId')
      .isMongoId()
      .withMessage('Valid comment ID is required'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Reply content is required')
      .isLength({ min: 1, max: 5000 })
      .withMessage('Reply must be between 1 and 5000 characters')
      .custom(value => {
        if (!value || value.trim().length === 0) {
          throw new Error('Reply cannot be empty or whitespace-only');
        }
        return true;
      }),
  ],

  adminListComments: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['pending', 'approved', 'rejected', 'spam'])
      .withMessage('Invalid comment status'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
  ],

  adminModerateComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    param('commentId')
      .isMongoId()
      .withMessage('Valid comment ID is required'),
    body('status')
      .notEmpty()
      .isIn(['approved', 'rejected', 'spam'])
      .withMessage('Valid status (approved, rejected, spam) is required'),
    body('reason')
      .optional()
      .trim()
      .isLength({ min: 3, max: 500 })
      .withMessage('Reason must be between 3 and 500 characters'),
  ],

  adminDeleteComment: [
    param('blogId')
      .isMongoId()
      .withMessage('Valid blog ID is required'),
    param('commentId')
      .isMongoId()
      .withMessage('Valid comment ID is required'),
  ],
};

// ============ PROFESSIONAL SERVICES ============
const professionalServiceValidators = {
  bookAdvisor: [
    body('advisorId')
      .isMongoId()
      .withMessage('Valid advisor ID is required'),
    body('preferredDate')
      .isISO8601()
      .withMessage('Valid preferred date is required'),
    body('preferredTime')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Must be in HH:MM format'),
    body('topic')
      .optional()
      .trim()
      .isLength({ min: 3, max: 500 })
      .withMessage('Topic must be between 3 and 500 characters'),
  ],

  submitDocumentReview: [
    body('documentType')
      .notEmpty()
      .isIn(['sop', 'cv', 'motivation-letter', 'cover-letter'])
      .withMessage('Valid document type is required'),
    body('documentUrl')
      .isURL()
      .withMessage('Valid document URL is required'),
    body('specialInstructions')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Instructions must be max 1000 characters'),
  ],

  bookCoachingSession: [
    body('universityId')
      .isMongoId()
      .withMessage('Valid university ID is required'),
    body('preferredDate')
      .isISO8601()
      .withMessage('Valid preferred date is required'),
    body('preferredTime')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Must be in HH:MM format'),
    body('focusArea')
      .optional()
      .trim()
      .isLength({ min: 3, max: 300 })
      .withMessage('Focus area must be between 3 and 300 characters'),
  ],

  submitTicket: [
    body('category')
      .notEmpty()
      .isIn(['visa-question', 'application-help', 'technical', 'billing', 'other'])
      .withMessage('Valid ticket category is required'),
    body('subject')
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 200 })
      .withMessage('Subject must be between 5 and 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 3000 })
      .withMessage('Description must be between 10 and 3000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid priority level'),
    body('attachmentUrl')
      .optional()
      .isURL()
      .withMessage('Valid attachment URL is required'),
  ],

  replyToTicket: [
    param('ticketId')
      .isMongoId()
      .withMessage('Valid ticket ID is required'),
    body('reply')
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 3000 })
      .withMessage('Reply must be between 5 and 3000 characters'),
    body('attachmentUrl')
      .optional()
      .isURL()
      .withMessage('Valid attachment URL is required'),
  ],

  updateTicketStatus: [
    param('ticketId')
      .isMongoId()
      .withMessage('Valid ticket ID is required'),
    body('status')
      .notEmpty()
      .isIn(['open', 'in-progress', 'waiting-customer', 'resolved', 'closed'])
      .withMessage('Valid status is required'),
  ],

  listTickets: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['open', 'in-progress', 'waiting-customer', 'resolved', 'closed'])
      .withMessage('Invalid status'),
    query('category')
      .optional()
      .isIn(['visa-question', 'application-help', 'technical', 'billing', 'other'])
      .withMessage('Invalid category'),
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid priority'),
  ],
};

/**
 * ============================================
 * ERROR HANDLING MIDDLEWARE
 * ============================================
 */

/**
 * Validation error handler middleware
 * Use this after validation rules to catch and format errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

/**
 * ============================================
 * NEWSLETTER SYSTEM
 * ============================================
 */

const newsletterValidators = {
  subscribe: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('preferences')
      .optional()
      .isObject()
      .withMessage('Preferences must be an object'),
    body('preferences.frequency')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
      .withMessage('Frequency must be daily, weekly, or monthly'),
  ],

  confirmSubscription: [
    param('token')
      .notEmpty()
      .withMessage('Confirmation token is required'),
  ],

  unsubscribe: [
    param('token')
      .notEmpty()
      .withMessage('Unsubscribe token is required'),
  ],

  updatePreferences: [
    body('frequency')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
      .withMessage('Frequency must be daily, weekly, or monthly'),
    body('categories')
      .optional()
      .isArray()
      .withMessage('Categories must be an array'),
  ],

  createDraft: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('subject')
      .trim()
      .notEmpty()
      .withMessage('Subject is required')
      .isLength({ min: 5, max: 200 })
      .withMessage('Subject must be between 5 and 200 characters'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ min: 50, max: 50000 })
      .withMessage('Content must be between 50 and 50000 characters'),
  ],

  updateDraft: [
    param('id')
      .isMongoId()
      .withMessage('Valid newsletter ID is required'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('subject')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Subject must be between 5 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 50, max: 50000 })
      .withMessage('Content must be between 50 and 50000 characters'),
  ],

  deleteDraft: [
    param('id')
      .isMongoId()
      .withMessage('Valid newsletter ID is required'),
  ],

  preview: [
    param('id')
      .isMongoId()
      .withMessage('Valid newsletter ID is required'),
  ],

  schedule: [
    param('id')
      .isMongoId()
      .withMessage('Valid newsletter ID is required'),
    body('scheduledDate')
      .isISO8601()
      .withMessage('Valid scheduled date is required'),
    body('recipientFilter')
      .notEmpty()
      .isObject()
      .withMessage('Recipient filter must be an object'),
    body('recipientFilter.type')
      .notEmpty()
      .isIn(['all', 'active', 'by-preference', 'by-category'])
      .withMessage('Filter type must be all, active, by-preference, or by-category'),
    body('recipientFilter.preference')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
      .withMessage('Preference must be daily, weekly, or monthly'),
    body('recipientFilter.categories')
      .optional()
      .isArray()
      .withMessage('Categories must be an array'),
  ],

  sendNow: [
    param('id')
      .isMongoId()
      .withMessage('Valid newsletter ID is required'),
    body('recipientFilter')
      .notEmpty()
      .isObject()
      .withMessage('Recipient filter must be an object'),
    body('recipientFilter.type')
      .notEmpty()
      .isIn(['all', 'active', 'by-preference', 'by-category'])
      .withMessage('Filter type must be all, active, by-preference, or by-category'),
  ],

  sendTest: [
    param('id')
      .isMongoId()
      .withMessage('Valid newsletter ID is required'),
    body('testEmail')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid test email is required'),
  ],

  listDrafts: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('sort')
      .optional()
      .isIn(['newest', 'oldest', 'title'])
      .withMessage('Invalid sort option'),
  ],

  listSubscribers: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['active', 'unsubscribed', 'bounced'])
      .withMessage('Invalid status'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
  ],

  updateSubscriberStatus: [
    param('id')
      .isMongoId()
      .withMessage('Valid subscriber ID is required'),
    body('status')
      .notEmpty()
      .isIn(['active', 'unsubscribed', 'bounced'])
      .withMessage('Status must be active, unsubscribed, or bounced'),
  ],

  removeSubscriber: [
    param('id')
      .isMongoId()
      .withMessage('Valid subscriber ID is required'),
  ],
};

/**
 * ============================================
 * EXPORTS
 * ============================================
 */

module.exports = {
  // Validators grouped by feature
  authValidators,
  userValidators,
  applicationValidators,
  documentValidators,
  paymentValidators,
  universityValidators,
  programValidators,
  jobValidators,
  blogValidators,
  blogCommentValidators,
  professionalServiceValidators,
  newsletterValidators,

  // Error handling
  handleValidationErrors,

  // Individual exports for backward compatibility
  ...authValidators,
  ...userValidators,
  ...applicationValidators,
  ...documentValidators,
  ...paymentValidators,
  ...universityValidators,
  ...programValidators,
  ...jobValidators,
  ...blogValidators,
  ...blogCommentValidators,
  ...professionalServiceValidators,
  ...newsletterValidators,
};
