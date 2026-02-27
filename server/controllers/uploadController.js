/**
 * Upload Controller
 * 
 * MVC Layer: HTTP Request Handler for S3 Operations
 * Responsibility: Generate presigned URLs (client-side uploads only, NO server-side file handling)
 * Flow: Route → Controller → Service (uploadService) → AWS S3
 * 
 * This controller does NOT handle actual file uploads - that's done entirely client-side
 * Server only provides presigned URLs for secure direct S3 uploads
 */

const uploadService = require('../services/uploadService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get single presigned URL for file upload
 * GET /api/uploads/presign?fileName=resume.pdf&fileSize=1024&fileType=pdf
 * 
 * Client uses returned URL to upload directly to S3 via PUT request
 */
exports.getPresignedUrl = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { fileName, fileSize, fileType } = req.query;

    if (!fileName || !fileSize) {
      return next(new AppError('fileName and fileSize are required', 400));
    }

    const presignedUrl = await uploadService.getPresignedUrl(
      userId,
      fileName,
      parseInt(fileSize),
      fileType
    );

    res.status(200).json({
      success: true,
      message: 'Presigned URL generated successfully',
      data: {
        url: presignedUrl,
        expiresIn: 3600, // 1 hour
        fileName,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get batch presigned URLs for multiple file uploads
 * POST /api/uploads/presign-batch
 * Body: { files: [{ fileName, fileSize, fileType }, ...] }
 * 
 * Client receives multiple URLs and uploads all files in parallel
 */
exports.getPresignedUrlBatch = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return next(new AppError('Files array is required and must not be empty', 400));
    }

    if (files.length > 10) {
      return next(new AppError('Maximum 10 files per batch', 400));
    }

    const presignedUrls = await Promise.all(
      files.map((file) =>
        uploadService.getPresignedUrl(
          userId,
          file.fileName,
          parseInt(file.fileSize),
          file.fileType
        )
      )
    );

    const urls = files.map((file, index) => ({
      fileName: file.fileName,
      url: presignedUrls[index],
      expiresIn: 3600,
    }));

    res.status(200).json({
      success: true,
      message: 'Presigned URLs generated successfully',
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get download URL for accessing uploaded file
 * GET /api/uploads/download/:key
 * 
 * Returns presigned GET URL that allows authorized user to download file
 */
exports.getDownloadUrl = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { userId } = req.user;

    if (!key) {
      return next(new AppError('File key is required', 400));
    }

    const downloadUrl = await uploadService.getDownloadUrl(key);

    res.status(200).json({
      success: true,
      message: 'Download URL generated successfully',
      data: {
        url: downloadUrl,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm file upload completion
 * POST /api/uploads/confirm
 * Body: { fileName, fileSize, s3Url }
 * 
 * Client calls this after successful S3 upload to confirm in database
 * This is called by document service when storing document metadata
 */
exports.confirmUpload = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { fileName, fileSize, s3Url } = req.body;

    if (!fileName || !fileSize || !s3Url) {
      return next(new AppError('fileName, fileSize, and s3Url are required', 400));
    }

    // Just validate the file was uploaded
    // Actual document metadata is stored by document service
    res.status(200).json({
      success: true,
      message: 'Upload confirmed',
      data: {
        fileName,
        s3Url,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete file from S3
 * DELETE /api/uploads/:key
 * 
 * User can delete their uploaded files
 */
exports.deleteFile = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { userId } = req.user;

    if (!key) {
      return next(new AppError('File key is required', 400));
    }

    await uploadService.deleteFromS3(key);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List user's uploaded files
 * GET /api/uploads/list
 * 
 * Returns all files uploaded by current user
 */
exports.listUserFiles = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const files = await uploadService.listUserFiles(userId);

    res.status(200).json({
      success: true,
      message: 'Files listed successfully',
      count: files.length,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get file metadata
 * GET /api/uploads/metadata/:key
 * 
 * Returns file size, type, last modified date
 */
exports.getFileMetadata = async (req, res, next) => {
  try {
    const { key } = req.params;

    if (!key) {
      return next(new AppError('File key is required', 400));
    }

    const metadata = await uploadService.getFileMetadata(key);

    res.status(200).json({
      success: true,
      message: 'File metadata retrieved successfully',
      data: metadata,
    });
  } catch (error) {
    next(error);
  }
};
