/**
 * Application Controller
 * 
 * MVC Layer: HTTP Request Handler
 * Responsibility: Parse requests → Call services → Format responses
 * Flow: Route → Controller → Service → Model → Database
 * 
 * Error Handling: Delegates to global errorHandler middleware
 * Validation: Applied at route level via validators/index.js
 */

const applicationService = require('../services/applicationService');
const { AppError, ValidationError } = require('../middleware/errorHandler');

/**
 * Create new application
 * POST /api/applications
 * Body: { universityId, programId, countryId, visaType, targetIntakeDate }
 */
exports.createApplication = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { universityId, programId, countryId, visaType, targetIntakeDate } = req.body;

    const application = await applicationService.createApplication({
      userId,
      universityId,
      programId,
      countryId,
      visaType,
      targetIntakeDate,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's applications
 * GET /api/applications
 * Query: ?status=pending&sortBy=createdAt&order=desc
 */
exports.getUserApplications = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;

    const applications = await applicationService.getUserApplications(userId, {
      status,
      sortBy,
      order,
    });

    res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single application by ID
 * GET /api/applications/:applicationId
 */
exports.getApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;

    const application = await applicationService.getApplicationById(applicationId, userId);

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application retrieved successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application details
 * PUT /api/applications/:applicationId
 * Body: { status, visaType, targetIntakeDate, notes }
 */
exports.updateApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;
    const updateData = req.body;

    const application = await applicationService.updateApplication(
      applicationId,
      userId,
      updateData
    );

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status
 * PATCH /api/applications/:applicationId/status
 * Body: { status, statusReason }
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;
    const { status, statusReason } = req.body;

    const application = await applicationService.updateApplicationStatus(
      applicationId,
      userId,
      status,
      statusReason
    );

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add document to application
 * POST /api/applications/:applicationId/documents
 * Body: { documentId, documentType }
 */
exports.addApplicationDocument = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;
    const { documentId, documentType } = req.body;

    const application = await applicationService.addApplicationDocument(
      applicationId,
      userId,
      documentId,
      documentType
    );

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Document added to application successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove document from application
 * DELETE /api/applications/:applicationId/documents/:documentId
 */
exports.removeApplicationDocument = async (req, res, next) => {
  try {
    const { applicationId, documentId } = req.params;
    const { userId } = req.user;

    const application = await applicationService.removeApplicationDocument(
      applicationId,
      userId,
      documentId
    );

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Document removed from application successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get application progress
 * GET /api/applications/:applicationId/progress
 */
exports.getApplicationProgress = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;

    const progress = await applicationService.getApplicationProgress(applicationId, userId);

    if (!progress) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application progress retrieved successfully',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete application
 * DELETE /api/applications/:applicationId
 */
exports.deleteApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;

    const success = await applicationService.deleteApplication(applicationId, userId);

    if (!success) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get application statistics for user
 * GET /api/applications/stats/overview
 */
exports.getApplicationStats = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const stats = await applicationService.getApplicationStats(userId);

    res.status(200).json({
      success: true,
      message: 'Application statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search applications
 * GET /api/applications/search
 * Query: ?country=Germany&university=TUM&status=pending
 */
exports.searchApplications = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { country, university, visaType, status } = req.query;

    const applications = await applicationService.searchApplications(userId, {
      country,
      university,
      visaType,
      status,
    });

    res.status(200).json({
      success: true,
      message: 'Applications search completed successfully',
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};
