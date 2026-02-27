/**
 * Document Controller
 * 
 * MVC Layer: HTTP Request Handler for Document Management
 * Responsibility: Parse requests → Call services → Format responses
 * Flow: Route → Controller → Service → Model → Database
 * 
 * Handles: Document metadata (NO server-side file upload - client uses S3 presigned URLs)
 */

const documentService = require('../services/documentService');
const sopService = require('../services/sopService');
const letterService = require('../services/letterService');
const uploadService = require('../services/uploadService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create document record after client uploads file to S3
 * POST /api/documents
 * Body: { applicationId, documentType, title, fileUrl, fileName, fileSize, mimeType }
 * 
 * Client flow: Request presigned URL → Upload file to S3 → Call this endpoint with S3 URL
 */
exports.createDocumentRecord = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { applicationId, documentType, title, fileUrl, fileName, fileSize, mimeType } = req.body;

    const document = await documentService.createDocument({
      userId,
      applicationId,
      documentType,
      title,
      fileUrl,
      fileName,
      fileSize: parseInt(fileSize),
      mimeType: mimeType || 'application/octet-stream',
    });

    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get presigned URL for direct S3 upload (client-side)
 * Note: This endpoint is now in uploadRoute.js and uploadController.js
 * GET /api/uploads/presign?fileName=resume.pdf&fileSize=1024
 */
exports.getPresignedUrl = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { fileName, fileSize } = req.query;

    if (!fileName || !fileSize) {
      return next(new AppError('fileName and fileSize are required', 400));
    }

    const presignedUrl = await uploadService.getPresignedUrl(
      userId,
      fileName,
      parseInt(fileSize)
    );

    res.status(200).json({
      success: true,
      message: 'Presigned URL generated successfully',
      data: {
        url: presignedUrl,
        expiresIn: 3600, // 1 hour
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's documents
 * GET /api/documents
 * Query: ?applicationId=xxx&documentType=passport
 */
exports.getUserDocuments = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { applicationId, documentType } = req.query;

    const documents = await documentService.getUserDocuments(userId, {
      applicationId,
      documentType,
    });

    res.status(200).json({
      success: true,
      message: 'Documents retrieved successfully',
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single document
 * GET /api/documents/:documentId
 */
exports.getDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.user;

    const document = await documentService.getDocument(documentId, userId);

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Document retrieved successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update document metadata
 * PUT /api/documents/:documentId
 * Body: { title, documentType, notes }
 */
exports.updateDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.user;
    const updateData = req.body;

    const document = await documentService.updateDocument(
      documentId,
      userId,
      updateData
    );

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete document
 * DELETE /api/documents/:documentId
 */
exports.deleteDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.user;

    const document = await documentService.getDocument(documentId, userId);

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    // Delete from S3
    await uploadService.deleteFromS3(document.fileUrl);

    // Delete from database
    await documentService.deleteDocument(documentId, userId);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get document templates
 * GET /api/documents/templates/:documentType
 * Example: /api/documents/templates/resume
 */
exports.getTemplate = async (req, res, next) => {
  try {
    const { documentType } = req.params;

    const template = await documentService.getTemplate(documentType);

    if (!template) {
      return next(new AppError('Template not found for document type', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Template retrieved successfully',
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all available templates
 * GET /api/documents/templates
 */
exports.listTemplates = async (req, res, next) => {
  try {
    const templates = await documentService.listTemplates();

    res.status(200).json({
      success: true,
      message: 'Templates retrieved successfully',
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify document completeness
 * POST /api/documents/:documentId/verify
 */
exports.verifyDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.user;

    const document = await documentService.getDocument(documentId, userId);

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    const verification = await documentService.verifyDocument(documentId);

    res.status(200).json({
      success: true,
      message: 'Document verification completed',
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate AI document
 * POST /api/documents/generate
 * Body: { documentType, applicationId, dataInputs }
 */
exports.generateDocument = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { documentType, applicationId, dataInputs = {} } = req.body;

    let document;
    if (documentType === 'sop') {
      const { university, program, userProfile, tone } = dataInputs;
      document = await sopService.generateSop({ university, program, userProfile, tone });
    } else if (documentType === 'motivation' || documentType === 'cover') {
      const { university, program, userProfile, tone } = dataInputs;
      document = await letterService.generateLetter({
        type: documentType,
        university,
        program,
        userProfile,
        tone,
      });
    } else {
      // generic fallback
      document = await documentService.createDocument({
        userId,
        applicationId,
        documentType,
        title: `Generated ${documentType}`,
        isAiGenerated: true,
        generatedAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Document generation completed',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get documents by application
 * GET /api/documents/application/:applicationId
 */
exports.getApplicationDocuments = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.user;

    const documents = await documentService.getApplicationDocuments(
      applicationId,
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Application documents retrieved successfully',
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};
