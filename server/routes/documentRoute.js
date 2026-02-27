/**
 * Document Routes
 * 
 * MVC Layer: HTTP Endpoint Definitions for Document Management
 * Responsibility: Define routes, apply validators, call controller methods
 * Flow: Route → Validator → Controller → Service → Model → Database
 * 
 * NO FILE UPLOAD HANDLING - File uploads done entirely client-side via S3
 * All endpoints protected by JWT authentication middleware
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { documentValidators, handleValidationErrors } = require('../validators');
const { requireFeature } = require('../middleware/featureUsage');
const documentController = require('../controllers/documentController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * POST /api/documents
 * Create document record after client uploads file to S3
 * Body: { applicationId, documentType, title, fileUrl, fileName, fileSize, mimeType }
 * 
 * Client flow:
 * 1. Request presigned URL from /api/uploads/presign
 * 2. Upload file to S3 using presigned URL
 * 3. Post document metadata here with returned S3 URL
 */
router.post(
  '/',
  documentValidators.create,
  handleValidationErrors,
  documentController.createDocumentRecord
);

/**
 * GET /api/documents/templates
 * List all available document templates
 */
router.get(
  '/templates',
  documentController.listTemplates
);

/**
 * GET /api/documents/templates/:documentType
 * Get specific template by type
 */
router.get(
  '/templates/:documentType',
  documentController.getTemplate
);

/**
 * GET /api/documents
 * Get user's documents with filters
 * Query: ?applicationId=xxx&documentType=sop
 */
router.get(
  '/',
  documentValidators.listWithPagination,
  handleValidationErrors,
  documentController.getUserDocuments
);

/**
 * GET /api/documents/application/:applicationId
 * Get all documents for specific application
 */
router.get(
  '/application/:applicationId',
  documentValidators.getApplicationDocuments,
  handleValidationErrors,
  documentController.getApplicationDocuments
);

/**
 * GET /api/documents/:documentId
 * Get single document details
 */
router.get(
  '/:documentId',
  documentValidators.getById,
  handleValidationErrors,
  documentController.getDocument
);

/**
 * PUT /api/documents/:documentId
 * Update document metadata (title, type, notes)
 * Does NOT handle file replacement - use presigned URL for new file
 */
router.put(
  '/:documentId',
  documentValidators.update,
  handleValidationErrors,
  documentController.updateDocument
);

/**
 * POST /api/documents/:documentId/verify
 * Verify document completeness and quality
 */
router.post(
  '/:documentId/verify',
  documentValidators.verify,
  handleValidationErrors,
  documentController.verifyDocument
);

/**
 * POST /api/documents/generate
 * Generate AI document (with Google Genkit)
 * Body: { documentType, applicationId }
 */
router.post(
  '/generate',
  requireFeature('ai_generation'),
  documentValidators.generate,
  handleValidationErrors,
  documentController.generateDocument
);

/**
 * DELETE /api/documents/:documentId
 * Delete document record and remove file from S3
 */
router.delete(
  '/:documentId',
  documentValidators.delete,
  handleValidationErrors,
  documentController.deleteDocument
);

/**
 * GET /api/documents/presign
 * Get presigned URL for direct S3 upload
 */
router.get(
  '/presign',
  documentValidators.presignedUrl,
  handleValidationErrors,
  documentController.getPresignedUrl
);

/**
 * GET /api/documents/templates
 * List all available templates
 */
router.get(
  '/templates',
  documentController.listTemplates
);

/**
 * GET /api/documents/templates/:documentType
 * Get template by type
 */
router.get(
  '/templates/:documentType',
  documentController.getTemplate
);

/**
 * GET /api/documents
 * Get user's documents with filters
 */
router.get(
  '/',
  documentValidators.listWithPagination,
  handleValidationErrors,
  documentController.getUserDocuments
);

module.exports = router;
