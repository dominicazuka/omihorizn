/**
 * Upload Routes
 * 
 * MVC Layer: HTTP Endpoint Definitions for S3 File Operations
 * Responsibility: Define routes, apply validators, call controller methods
 * Flow: Route → Validator → Controller → Service → AWS S3
 * 
 * NO FILE UPLOAD HANDLING - Client uploads directly to S3 using presigned URLs
 * All endpoints protected by JWT authentication middleware
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { uploadValidators, handleValidationErrors } = require('../validators');
const uploadController = require('../controllers/uploadController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /api/uploads/presign
 * Get presigned URL for single file upload
 * Query params: ?fileName=resume.pdf&fileSize=1024&fileType=pdf
 */
router.get(
  '/presign',
  uploadValidators.presignUrl,
  handleValidationErrors,
  uploadController.getPresignedUrl
);

/**
 * POST /api/uploads/presign-batch
 * Get presigned URLs for multiple file uploads
 * Body: { files: [{ fileName, fileSize, fileType }, ...] }
 */
router.post(
  '/presign-batch',
  uploadValidators.generateBatch,
  handleValidationErrors,
  uploadController.getPresignedUrlBatch
);

/**
 * GET /api/uploads/download/:key
 * Get presigned download URL for file
 */
router.get(
  '/download/:key',
  uploadController.getDownloadUrl
);

/**
 * GET /api/uploads/list
 * List all files uploaded by user
 */
router.get(
  '/list',
  uploadController.listUserFiles
);

/**
 * GET /api/uploads/metadata/:key
 * Get file metadata (size, type, modified date)
 */
router.get(
  '/metadata/:key',
  uploadController.getFileMetadata
);

/**
 * POST /api/uploads/confirm
 * Confirm upload completion after client-side S3 upload
 * Body: { fileName, fileSize, s3Url }
 */
router.post(
  '/confirm',
  uploadValidators.confirmUpload,
  handleValidationErrors,
  uploadController.confirmUpload
);

/**
 * DELETE /api/uploads/:key
 * Delete file from S3
 */
router.delete(
  '/:key',
  uploadController.deleteFile
);

module.exports = router;
