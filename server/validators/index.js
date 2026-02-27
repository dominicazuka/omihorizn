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
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
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

// --------- ADMIN-SPECIFIC VALIDATORS ----------
// Used by admin authentication and user management endpoints
const adminValidators = {
  auth: {
    login: [
      body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
      body('password').notEmpty().withMessage('Password is required'),
      body('otpCode')
        .optional()
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage('OTP code must be 6 digits'),
    ],
    logout: [
      body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    ],
  },
  user: {
    list: [
      query('page').optional().isInt({ min: 1 }).toInt(),
      query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
      query('search').optional().trim(),
    ],
    get: [param('id').isMongoId().withMessage('Valid user ID is required')],
    suspend: [param('id').isMongoId().withMessage('Valid user ID is required')],
    activate: [param('id').isMongoId().withMessage('Valid user ID is required')],
    delete: [param('id').isMongoId().withMessage('Valid user ID is required')],
    resetPassword: [param('id').isMongoId().withMessage('Valid user ID is required')],
    viewDocs: [param('id').isMongoId().withMessage('Valid user ID is required')],
    bulkAction: [
      body('userIds').isArray({ min: 1 }).withMessage('userIds must be an array'),
      body('action').isIn(['suspend', 'activate', 'delete']).withMessage('Invalid bulk action'),
    ],
    approve: [param('id').isMongoId().withMessage('Valid user ID is required')],
    reject: [param('id').isMongoId().withMessage('Valid user ID is required')],
  },
};

// ---------- Visa Engines Validators ----------
const visaEngineValidators = {
  skillMatch: [
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('experience').optional(),
  ],
  feasibility: [
    body('countries').optional().isArray().withMessage('Countries must be an array'),
  ],
  prPathway: [
    body('countryId').notEmpty().isMongoId().withMessage('Valid countryId is required'),
  ],
};

// ---------- Visa Data Validators ----------
const visaDataValidators = {
  getRequirements: [param('country').notEmpty(), param('visaType').optional()],
  getPathways: [param('country').notEmpty()],
  getLabourShortages: [param('country').notEmpty()],
  adminCreate: [body('countryId').isMongoId().notEmpty()],
  adminUpdate: [param('id').isMongoId().notEmpty()],
};

// ---------- Dependent Visa Validators ----------
const dependentVisaValidators = {
  getDependent: [param('country').notEmpty(), param('visaType').notEmpty()],
  getFamilyRelocation: [param('country').notEmpty()],
  familyCostEstimate: [body('countryId').isMongoId().notEmpty(), body('familySize').isInt({ min: 1 })],
  adminCreate: [body('countryId').isMongoId().notEmpty(), body('visaType').notEmpty()],
  adminUpdate: [param('id').isMongoId().notEmpty()],
};

// ---------- Settlement Validators ----------
const settlementValidators = {
  getResources: [param('country').notEmpty()],
  getPRTimeline: [param('country').notEmpty()],
  getSchengen: [param('country').notEmpty()],
  jobMarketAnalysis: [param('country').notEmpty()],
  adminCreate: [body('countryId').isMongoId().notEmpty(), body('category').notEmpty()],
  adminUpdate: [param('id').isMongoId().notEmpty()],
};

// ---------- Post-Acceptance Validators ----------
const postAcceptanceValidators = {
  initChecklist: [param('appId').isMongoId(), body('items').optional().isArray()],
  getChecklist: [param('appId').isMongoId()],
  markItem: [param('appId').isMongoId(), param('itemId').isMongoId(), body('status').isIn(['pending','completed'])],
  getAccommodation: [param('country').notEmpty()],
  getStudentLife: [param('country').notEmpty()],
  getPreArrival: [param('country').notEmpty()],
  costEstimate: [body('countryId').isMongoId(), body('familySize').optional().isInt({ min: 1 })],
};

// ---------- Admin Data Validators ----------
const adminDataValidators = {
  import: [param('model').notEmpty(), body('records').isArray()],
  export: [param('model').notEmpty()],
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
    param('applicationId')
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

  updateStatus: [
    param('applicationId')
      .isMongoId()
      .withMessage('Valid application ID is required'),
    body('status')
      .notEmpty()
      .isIn(['draft', 'submitted', 'under-review', 'pending-documents', 'rejected', 'accepted', 'conditional-accept', 'deferred'])
      .withMessage('Invalid application status'),
  ],

  addDocument: [
    param('applicationId')
      .isMongoId()
      .withMessage('Valid application ID is required'),
    body('documentId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid document ID is required'),
    body('documentType')
      .notEmpty()
      .trim()
      .withMessage('Document type is required'),
  ],

  removeDocument: [
    param('applicationId')
      .isMongoId()
      .withMessage('Valid application ID is required'),
    param('documentId')
      .isMongoId()
      .withMessage('Valid document ID is required'),
  ],

  delete: [
    param('applicationId')
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
  create: [
    body('applicationId')
      .optional()
      .isMongoId()
      .withMessage('Valid application ID is required'),
    body('documentType')
      .trim()
      .notEmpty()
      .isIn(['sop', 'cv', 'cover-letter', 'transcript', 'ielts', 'gre', 'gmat', 'other'])
      .withMessage('Valid document type is required'),
    body('title')
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('fileUrl')
      .isURL()
      .withMessage('Valid S3 file URL is required'),
    body('fileName')
      .trim()
      .notEmpty()
      .withMessage('File name is required'),
    body('fileSize')
      .isInt({ min: 1, max: 52428800 })
      .withMessage('Valid file size is required'),
  ],

  getById: [
    param('documentId')
      .isMongoId()
      .withMessage('Valid document ID is required'),
  ],

  update: [
    param('documentId')
      .isMongoId()
      .withMessage('Valid document ID is required'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('documentType')
      .optional()
      .trim()
      .isIn(['sop', 'cv', 'cover-letter', 'transcript', 'ielts', 'gre', 'gmat', 'other'])
      .withMessage('Valid document type is required'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be max 1000 characters'),
  ],

  verify: [
    param('documentId')
      .isMongoId()
      .withMessage('Valid document ID is required'),
  ],

  generate: [
    body('documentType')
      .notEmpty()
      .trim()
      .withMessage('Document type is required'),
    body('applicationId')
      .optional()
      .isMongoId()
      .withMessage('Valid application ID is required'),
    body('dataInputs')
      .optional()
      .isObject()
      .withMessage('dataInputs must be an object'),
  ],

  delete: [
    param('documentId')
      .isMongoId()
      .withMessage('Valid document ID is required'),
  ],

  getApplicationDocuments: [
    param('applicationId')
      .isMongoId()
      .withMessage('Valid application ID is required'),
  ],

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

// ============ FILE UPLOADS (S3) ============
const uploadValidators = {
  presignUrl: [
    query('fileName')
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 255 })
      .withMessage('File name must be between 1 and 255 characters'),
    query('fileSize')
      .notEmpty()
      .isInt({ min: 1, max: 52428800 }) // 50MB max
      .withMessage('File size must be between 1 and 50MB'),
    query('fileType')
      .optional()
      .trim()
      .isIn(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xlsx', 'xls', 'ppt', 'pptx'])
      .withMessage('Valid file type is required'),
  ],

  generateBatch: [
    body('files')
      .isArray({ min: 1, max: 10 })
      .withMessage('Files array must contain 1-10 items'),
    body('files.*.fileName')
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 255 })
      .withMessage('Each file name must be between 1 and 255 characters'),
    body('files.*.fileSize')
      .isInt({ min: 1, max: 52428800 })
      .withMessage('Each file size must be between 1 and 50MB'),
    body('files.*.fileType')
      .optional()
      .trim()
      .isIn(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xlsx', 'xls', 'ppt', 'pptx'])
      .withMessage('Valid file type is required'),
  ],

  confirmUpload: [
    body('fileName')
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 255 })
      .withMessage('File name is required'),
    body('fileSize')
      .isInt({ min: 1 })
      .withMessage('Valid file size is required'),
    body('s3Url')
      .isURL()
      .withMessage('Valid S3 URL is required'),
  ],
};

// ============ PAYMENTS & SUBSCRIPTIONS ============
const paymentValidators = {
  createPayment: [
    body('subscriptionId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid subscription ID is required'),
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Valid amount (in cents) is required'),
    body('currency')
      .optional()
      .isIn(['EUR', 'USD', 'GBP', 'NGN'])
      .withMessage('Valid currency is required'),
    body('description')
      .optional()
      .trim()
      .notEmpty(),
    body('customer')
      .optional()
      .isObject()
      .withMessage('Customer must be an object'),
    body('customer.name')
      .optional()
      .trim()
      .notEmpty(),
    body('customer.email')
      .optional()
      .isEmail()
      .normalizeEmail(),
    body('customer.phone')
      .optional()
      .trim()
      .notEmpty(),
  ],

  verifyPayment: [
    body('paymentId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid payment ID is required'),
    body('flutterwaveTransactionId')
      .notEmpty()
      .withMessage('Flutterwave transaction ID is required'),
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

  history: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
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

// ---------- Subscription Validators (re-exported from paymentValidators) ----------
const subscriptionValidators = {
  updateSubscription: paymentValidators.updateSubscription,
  cancelSubscription: paymentValidators.cancelSubscription,
  history: paymentValidators.history,
  getUsageHistory: paymentValidators.getUsageHistory,
};

// ============ COUNTRIES & VISA INFORMATION ============
const countryValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .isLength({ min: 2, max: 100 })
      .withMessage('Country name must be between 2 and 100 characters'),
    body('code')
      .trim()
      .notEmpty()
      .isLength({ min: 2, max: 3 })
      .withMessage('Country code must be 2-3 characters (ISO 3166-1)'),
    body('region')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Region must not be empty'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be between 10 and 5000 characters'),
  ],

  update: [
    param('id')
      .custom(id => id.match(/^[0-9a-fA-F]{24}$/) || /^[A-Z]{2,3}$/.test(id))
      .withMessage('Valid country ID or code is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Country name must be between 2 and 100 characters'),
    body('code')
      .optional()
      .trim()
      .isLength({ min: 2, max: 3 })
      .withMessage('Country code must be 2-3 characters'),
  ],

  delete: [
    param('id')
      .custom(id => id.match(/^[0-9a-fA-F]{24}$/) || /^[A-Z]{2,3}$/.test(id))
      .withMessage('Valid country ID or code is required'),
  ],

  getDetail: [
    param('id')
      .custom(id => id.match(/^[0-9a-fA-F]{24}$/) || /^[A-Z]{2,3}$/.test(id))
      .withMessage('Valid country ID or code is required'),
  ],

  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('region')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Region must not be empty'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
  ],

  search: [
    query('q')
      .notEmpty()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query is required'),
  ],

  bulkImport: [
    body('countries')
      .isArray()
      .withMessage('Countries must be an array'),
    body('countries')
      .custom(arr => arr.length <= 500)
      .withMessage('Cannot import more than 500 countries at once'),
  ],
};

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
    query('region')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Region must not be empty'),
    query('minRanking')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Minimum ranking must be a positive integer'),
    query('maxRanking')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Maximum ranking must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Country must not be empty'),
    query('region')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Region must not be empty'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
    query('sortBy')
      .optional()
      .isIn(['name', 'qs_ranking', 'times_ranking', 'viewCount'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
  ],

  getDetail: [
    param('id')
      .isMongoId()
      .withMessage('Valid university ID is required'),
  ],

  incrementView: [
    param('id')
      .isMongoId()
      .withMessage('Valid university ID is required'),
  ],

  compare: [
    body('universityIds')
      .isArray({ min: 2, max: 5 })
      .withMessage('Please provide 2 to 5 university IDs'),
    body('universityIds.*')
      .isMongoId()
      .withMessage('Each ID must be a valid MongoDB ObjectId'),
  ],

  delete: [
    param('id')
      .isMongoId()
      .withMessage('Valid university ID is required'),
  ],

  bulkImport: [
    body('universities')
      .isArray()
      .withMessage('Universities must be an array'),
    body('universities')
      .custom(arr => arr.length <= 1000)
      .withMessage('Cannot import more than 1000 universities at once'),
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
    body('field')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Field of study must not be empty'),
    body('level')
      .notEmpty()
      .isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
      .withMessage('Valid degree level is required'),
    body('tuitionFee')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid tuition fee is required'),
    body('applicationDeadline')
      .optional()
      .isISO8601()
      .withMessage('Valid application deadline is required'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be between 10 and 5000 characters'),
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Valid program ID is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Program name must be between 2 and 200 characters'),
    body('level')
      .optional()
      .isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
      .withMessage('Valid degree level is required'),
    body('field')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Field of study must not be empty'),
  ],

  delete: [
    param('id')
      .isMongoId()
      .withMessage('Valid program ID is required'),
  ],

  getDetail: [
    param('id')
      .isMongoId()
      .withMessage('Valid program ID is required'),
  ],

  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),
    query('universityId')
      .optional()
      .isMongoId()
      .withMessage('Valid university ID is required'),
    query('field')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Field must not be empty'),
    query('degree')
      .optional()
      .isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
      .withMessage('Invalid degree level'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
  ],

  search: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
    query('field')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Field must not be empty'),
    query('degree')
      .optional()
      .isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
      .withMessage('Invalid degree level'),
    query('minTuition')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum tuition must be a valid number'),
    query('maxTuition')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum tuition must be a valid number'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  bulkImport: [
    body('programs')
      .isArray()
      .withMessage('Programs must be an array'),
    body('programs')
      .custom(arr => arr.length <= 2000)
      .withMessage('Cannot import more than 2000 programs at once'),
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

// ============ PRICING VALIDATORS ============
// used by admin pricing endpoints
const pricingValidators = {
  upsertPlan: [
    body('tier')
      .notEmpty()
      .isIn(['free', 'premium', 'professional'])
      .withMessage('Tier must be one of free, premium, professional'),
    body('name').optional().isString().trim().withMessage('Name must be text'),
    body('monthlyPrice').optional().isInt({ min: 0 }).withMessage('monthlyPrice must be integer cents'),
    body('annualPrice').optional().isInt({ min: 0 }).withMessage('annualPrice must be integer cents'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    body('addOns').optional().isArray().withMessage('AddOns must be an array'),
  ],
};

// ============ AI FEATURE VALIDATORS ============
const sopValidators = {
  generate: [
    body('university').notEmpty().withMessage('University is required'),
    body('program').notEmpty().withMessage('Program is required'),
    body('userProfile').notEmpty().withMessage('User profile is required'),
    body('tone').optional().isString(),
  ],
  regenerate: [
    // reuse the same rules as generate plus a document id
    body('university').notEmpty().withMessage('University is required'),
    body('program').notEmpty().withMessage('Program is required'),
    body('userProfile').notEmpty().withMessage('User profile is required'),
    body('tone').optional().isString(),
    body('docId').notEmpty().isMongoId().withMessage('Document ID required'),
  ],
  score: [
    body('text').notEmpty().withMessage('Text required for scoring'),
  ],
};

const letterValidators = {
  generate: [
    body('type')
      .notEmpty()
      .isIn(['motivation', 'cover'])
      .withMessage('Type must be motivation or cover'),
    body('university').notEmpty().withMessage('University is required'),
    body('program').notEmpty().withMessage('Program is required'),
    body('userProfile').notEmpty().withMessage('User profile is required'),
    body('tone').optional().isString(),
  ],
  regenerate: [
    body('docId').notEmpty().isMongoId().withMessage('Document ID required'),
    body('options').optional().isObject().withMessage('Options object expected'),
  ],
};

const interviewValidators = {
  generate: [
    body('university').notEmpty().withMessage('University is required'),
    body('program').notEmpty().withMessage('Program is required'),
    body('userProfile').optional().isString(),
    body('difficulty').optional().isIn(['easy','medium','hard']),
  ],
  answers: [
    body('questions').isArray().withMessage('Questions array required'),
    body('userProfile').optional().isString(),
  ],
  feedback: [
    body('userId').notEmpty().isMongoId(),
    body('sessionId').notEmpty().withMessage('sessionId required'),
    body('feedback').notEmpty().withMessage('Feedback required'),
  ],
};

const recommendationValidators = {
  recommend: [
    body('userProfile').notEmpty().withMessage('User profile text required'),
    body('filters').optional().isObject().withMessage('Filters must be object'),
    body('budget').optional().isNumeric().withMessage('Budget must be number'),
  ],
  track: [
    body('userId').optional().isMongoId(),
    body('universityId').isMongoId().withMessage('University ID required'),
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
  adminValidators,
  userValidators,
  applicationValidators,
  documentValidators,
  uploadValidators,
  paymentValidators,
  subscriptionValidators,
  countryValidators,
  universityValidators,
  programValidators,
  jobValidators,
  blogValidators,
  blogCommentValidators,
  professionalServiceValidators,
  newsletterValidators,
  pricingValidators,
  visaEngineValidators,
  visaDataValidators,
  dependentVisaValidators,
  settlementValidators,
  postAcceptanceValidators,
  adminDataValidators,

  // Error handling
  handleValidationErrors,

  // Individual exports for backward compatibility
  ...authValidators,
  ...userValidators,
  ...applicationValidators,
  ...documentValidators,
  ...uploadValidators,
  ...paymentValidators,
  ...subscriptionValidators,
  ...countryValidators,
  ...universityValidators,
  ...programValidators,
  ...jobValidators,
  ...blogValidators,
  ...blogCommentValidators,
  ...professionalServiceValidators,
  ...newsletterValidators,
  ...pricingValidators,
  sopValidators,
  letterValidators,
  interviewValidators,
  recommendationValidators,
  visaEngineValidators,
  visaDataValidators,
  dependentVisaValidators,
  settlementValidators,
  postAcceptanceValidators,
  adminDataValidators,
  adminValidators,
  blogValidators,
  blogCommentValidators,
  newsletterValidators,
};
