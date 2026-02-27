/**
 * Application Service
 * 
 * MVC Layer: Business Logic Handler
 * Responsibility: Core business rules, database operations, validation
 * Flow: Controller → Service → Model → Database
 * 
 * No HTTP operations here - pure business logic
 */

const Application = require('../models/Application');
const University = require('../models/University');
const Country = require('../models/Country');
const Program = require('../models/Program');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create new application
 */
exports.createApplication = async ({
  userId,
  universityId,
  programId,
  countryId,
  visaType,
  targetIntakeDate,
}) => {
  // Validate references exist
  const [university, program, country] = await Promise.all([
    University.findById(universityId),
    Program.findById(programId),
    Country.findById(countryId),
  ]);

  if (!university) {
    throw new AppError('University not found', 404);
  }
  if (!program) {
    throw new AppError('Program not found', 404);
  }
  if (!country) {
    throw new AppError('Country not found', 404);
  }

  // Verify program belongs to university
  if (program.universityId.toString() !== universityId) {
    throw new AppError('Program does not belong to this university', 400);
  }

  // Check for duplicate application (same user + university + program)
  const existingApp = await Application.findOne({
    userId,
    universityId,
    programId,
  });

  if (existingApp) {
    throw new AppError('You already have an application to this program', 400);
  }

  // Create application
  const application = new Application({
    userId,
    universityId,
    programId,
    countryId,
    visaType,
    targetIntakeDate,
    status: 'draft',
    statusHistory: [
      {
        status: 'draft',
        timestamp: new Date(),
        reason: 'Application created',
      },
    ],
    documents: [],
    progress: {
      personalInfoComplete: true,
      documentationComplete: false,
      paymentComplete: false,
      overallPercentage: 20,
    },
  });

  await application.save();
  return application.populate(['universityId', 'programId', 'countryId']);
};

/**
 * Get user's applications with filters
 */
exports.getUserApplications = async (userId, { status, sortBy, order }) => {
  const query = { userId };

  if (status) {
    query.status = status;
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const applications = await Application.find(query)
    .sort(sort)
    .populate(['universityId', 'programId', 'countryId'])
    .lean();

  return applications;
};

/**
 * Get single application (with ownership verification)
 */
exports.getApplicationById = async (applicationId, userId) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  }).populate(['universityId', 'programId', 'countryId']);

  return application;
};

/**
 * Update application details
 */
exports.updateApplication = async (applicationId, userId, updateData) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    return null;
  }

  // Allowed fields to update
  const allowedFields = [
    'visaType',
    'targetIntakeDate',
    'notes',
    'expectedDecisionDate',
  ];

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      application[key] = updateData[key];
    }
  });

  application.updatedAt = new Date();
  await application.save();

  return application.populate(['universityId', 'programId', 'countryId']);
};

/**
 * Update application status with history
 */
exports.updateApplicationStatus = async (
  applicationId,
  userId,
  newStatus,
  statusReason
) => {
  const validStatuses = [
    'draft',
    'submitted',
    'under-review',
    'pending-documents',
    'rejected',
    'accepted',
    'conditional-accept',
    'deferred',
  ];

  if (!validStatuses.includes(newStatus)) {
    throw new AppError('Invalid application status', 400);
  }

  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    return null;
  }

  // Don't allow status change if already in final state
  if (['rejected', 'accepted'].includes(application.status)) {
    throw new AppError('Cannot change status of final application outcome', 400);
  }

  // Add to status history
  application.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    reason: statusReason || 'Status updated',
  });

  application.status = newStatus;

  // Update progress if submitted
  if (newStatus === 'submitted') {
    application.progress.overallPercentage = 80;
    application.submittedAt = new Date();
  }

  application.updatedAt = new Date();
  await application.save();

  return application.populate(['universityId', 'programId', 'countryId']);
};

/**
 * Add document to application
 */
exports.addApplicationDocument = async (
  applicationId,
  userId,
  documentId,
  documentType
) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    return null;
  }

  // Check if document already added
  const docExists = application.documents.some((doc) => doc.documentId.toString() === documentId);

  if (docExists) {
    throw new AppError('This document is already added to the application', 400);
  }

  // Add document
  application.documents.push({
    documentId,
    documentType,
    addedAt: new Date(),
  });

  // Update progress
  if (application.documents.length > 0) {
    application.progress.documentationComplete = true;
    application.progress.overallPercentage = Math.min(
      50,
      application.progress.overallPercentage + 15
    );
  }

  application.updatedAt = new Date();
  await application.save();

  return application.populate(['universityId', 'programId', 'countryId']);
};

/**
 * Remove document from application
 */
exports.removeApplicationDocument = async (applicationId, userId, documentId) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    return null;
  }

  // Remove document
  application.documents = application.documents.filter(
    (doc) => doc.documentId.toString() !== documentId
  );

  // Update progress
  if (application.documents.length === 0) {
    application.progress.documentationComplete = false;
  }

  application.updatedAt = new Date();
  await application.save();

  return application.populate(['universityId', 'programId', 'countryId']);
};

/**
 * Get application progress details
 */
exports.getApplicationProgress = async (applicationId, userId) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  }).lean();

  if (!application) {
    return null;
  }

  // Calculate detailed progress breakdown
  const progressDetails = {
    _id: application._id,
    overallPercentage: application.progress.overallPercentage,
    sections: {
      personalInfo: {
        complete: application.progress.personalInfoComplete,
        percentage: application.progress.personalInfoComplete ? 25 : 0,
      },
      documentation: {
        complete: application.progress.documentationComplete,
        documentsAdded: application.documents.length,
        percentage: application.progress.documentationComplete ? 25 : 0,
      },
      payment: {
        complete: application.progress.paymentComplete,
        percentage: application.progress.paymentComplete ? 25 : 0,
      },
      submission: {
        complete: application.status === 'submitted',
        percentage: application.status === 'submitted' ? 25 : 0,
      },
    },
    lastUpdated: application.updatedAt,
  };

  return progressDetails;
};

/**
 * Delete application
 */
exports.deleteApplication = async (applicationId, userId) => {
  const result = await Application.findOneAndDelete({
    _id: applicationId,
    userId,
  });

  return result !== null;
};

/**
 * Get application statistics for user
 */
exports.getApplicationStats = async (userId) => {
  const applications = await Application.find({ userId }).lean();

  const stats = {
    total: applications.length,
    byStatus: {},
    byCountry: {},
    byUniversity: {},
    dueWithin30Days: 0,
  };

  // Count by status
  applications.forEach((app) => {
    stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
  });

  // Count by country and university (would need population for this)
  // For now, return basic stats
  stats.recentlyUpdated = applications
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map((app) => ({
      _id: app._id,
      status: app.status,
      updatedAt: app.updatedAt,
    }));

  return stats;
};

/**
 * Search applications with filters
 */
exports.searchApplications = async (userId, { country, university, visaType, status }) => {
  const query = { userId };

  if (status) {
    query.status = status;
  }
  if (visaType) {
    query.visaType = visaType;
  }
  if (country) {
    const countryDoc = await Country.findOne({
      $or: [{ name: new RegExp(country, 'i') }, { code: country.toUpperCase() }],
    });
    if (countryDoc) {
      query.countryId = countryDoc._id;
    }
  }
  if (university) {
    const univDoc = await University.findOne({
      name: new RegExp(university, 'i'),
    });
    if (univDoc) {
      query.universityId = univDoc._id;
    }
  }

  const applications = await Application.find(query)
    .populate(['universityId', 'programId', 'countryId'])
    .lean();

  return applications;
};
