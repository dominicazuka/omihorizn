/**
 * Upload Service
 * 
 * AWS S3 Integration Service (AWS SDK v3)
 * Responsibility: File upload/download, S3 operations, presigned URLs
 * 
 * NOTE: Requires AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET env vars
 */

const { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, HeadObjectCommand, CopyObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');

const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET = process.env.AWS_S3_BUCKET;
const S3_FOLDER = 'omihorizn-documents';

// Initialize S3 Client (v3)
const s3Client = new S3Client({
  region: REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

/**
 * Helper: Create safe filename
 */
function makeSafeFilename(name = '') {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Helper: Generate unique S3 key
 */
function makeKey(entityId, filename = '') {
  const safe = makeSafeFilename(filename);
  const rnd = crypto.randomBytes(6).toString('hex');
  return `${S3_FOLDER}/${entityId}/${Date.now()}-${rnd}-${safe}`;
}

/**
 * Helper: Get public URL for S3 object
 */
function getPublicUrl(key) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

/**
 * Helper: Extract key from public URL
 */
function getKeyFromUrl(publicUrl) {
  if (!publicUrl) return null;
  try {
    const url = new URL(publicUrl);
    return url.pathname.substring(1);
  } catch (e) {
    return null;
  }
}

/**
 * Helper function to get MIME type from extension
 */
function getMimeType(extension) {
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

/**
 * Upload file to S3
 * NOTE: This is rarely used now since client uploads directly via presigned URLs
 */
exports.uploadToS3 = async (file, userId) => {
  if (!BUCKET) {
    throw new AppError('S3 bucket not configured', 500);
  }

  const key = makeKey(userId, file.originalname);

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalName: file.originalname,
      userId: userId.toString(),
      uploadedAt: new Date().toISOString(),
    },
  });

  try {
    await s3Client.send(cmd);
    console.log(`✅ File uploaded to S3: ${key}`);
    return getPublicUrl(key);
  } catch (error) {
    console.error('❌ S3 upload error:', error.message);
    throw new AppError('Failed to upload file to S3', 500);
  }
};

/**
 * Get presigned URL for direct browser upload
 * Client can upload directly to S3 using this URL (PUT request)
 * Expires in 15 minutes (900 seconds)
 */
exports.getPresignedUrl = async (userId, fileName, fileSize, fileType) => {
  if (!BUCKET) {
    throw new AppError('S3 bucket not configured', 500);
  }

  // Validate file size (max 50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  if (fileSize > MAX_FILE_SIZE) {
    throw new AppError('File size exceeds maximum limit (50MB)', 400);
  }

  // Validate file type
  const extension = path.extname(fileName).toLowerCase();
  const validExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx', '.xls', '.ppt', '.pptx'];

  if (!validExtensions.includes(extension)) {
    throw new AppError('File type not allowed', 400);
  }

  try {
    const key = makeKey(userId, fileName);
    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType || getMimeType(extension),
    });

    const presignedUrl = await getSignedUrl(s3Client, cmd, { expiresIn: 900 }); // 15 minutes

    console.log(`✅ Presigned URL generated for: ${key}`);

    return presignedUrl;
  } catch (error) {
    console.error('❌ Presigned URL generation error:', error.message);
    throw new AppError('Failed to generate upload URL', 500);
  }
};

/**
 * Get batch presigned URLs for multiple file uploads
 */
exports.getPresignedUrlBatch = async (userId, files) => {
  if (!BUCKET) {
    throw new AppError('S3 bucket not configured', 500);
  }

  try {
    const results = [];

    for (const file of files) {
      const { fileName, fileSize, fileType } = file;
      const presignedUrl = await exports.getPresignedUrl(userId, fileName, fileSize, fileType);
      results.push({ fileName, presignedUrl });
    }

    return results;
  } catch (error) {
    console.error('❌ Batch presigned URL error:', error.message);
    throw new AppError('Failed to generate batch presigned URLs', 500);
  }
};

/**
 * Delete file from S3
 */
exports.deleteFromS3 = async (fileUrl) => {
  if (!BUCKET || !fileUrl) {
    return;
  }

  try {
    const key = getKeyFromUrl(fileUrl);
    if (!key) return;

    const cmd = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    await s3Client.send(cmd);
    console.log(`✅ File deleted from S3: ${key}`);
  } catch (error) {
    console.error('⚠️  Warning: Failed to delete file from S3:', error.message);
    // Don't throw - file may already be deleted
  }
};

/**
 * Get signed download URL for file
 */
exports.getDownloadUrl = async (fileUrl, expiresIn = 3600) => {
  if (!BUCKET || !fileUrl) {
    throw new AppError('Invalid file URL', 400);
  }

  try {
    const key = getKeyFromUrl(fileUrl);
    if (!key) throw new AppError('Invalid file URL format', 400);

    const cmd = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, cmd, { expiresIn });

    return signedUrl;
  } catch (error) {
    console.error('❌ Download URL generation error:', error.message);
    throw new AppError('Failed to generate download URL', 500);
  }
};

/**
 * List user's files in S3
 */
exports.listUserFiles = async (userId) => {
  if (!BUCKET) {
    throw new AppError('S3 bucket not configured', 500);
  }

  try {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: `${S3_FOLDER}/${userId}/`,
    });

    const result = await s3Client.send(cmd);

    const files = (result.Contents || []).map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: getPublicUrl(item.Key),
    }));

    return files;
  } catch (error) {
    console.error('❌ List files error:', error.message);
    throw new AppError('Failed to list files', 500);
  }
};

/**
 * Cleanup old files (admin operation)
 * Delete files older than specified days
 */
exports.cleanupOldFiles = async (userId, daysOld = 90) => {
  if (!BUCKET) {
    throw new AppError('S3 bucket not configured', 500);
  }

  try {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: `${S3_FOLDER}/${userId}/`,
    });

    const result = await s3Client.send(cmd);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const filesToDelete = [];

    (result.Contents || []).forEach((item) => {
      if (item.LastModified < cutoffDate) {
        filesToDelete.push({ Key: item.Key });
      }
    });

    if (filesToDelete.length === 0) {
      return { deleted: 0 };
    }

    // Delete in batches (max 1000 per request)
    const batches = [];
    for (let i = 0; i < filesToDelete.length; i += 1000) {
      batches.push(filesToDelete.slice(i, i + 1000));
    }

    let deletedCount = 0;

    for (const batch of batches) {
      const deleteCmd = new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: batch },
      });

      await s3Client.send(deleteCmd);
      deletedCount += batch.length;
    }

    console.log(`✅ Cleaned up ${deletedCount} old files for user: ${userId}`);

    return { deleted: deletedCount };
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
    throw new AppError('Failed to cleanup old files', 500);
  }
};

/**
 * Get file metadata
 */
exports.getFileMetadata = async (fileUrl) => {
  if (!BUCKET || !fileUrl) {
    throw new AppError('Invalid file URL', 400);
  }

  try {
    const key = getKeyFromUrl(fileUrl);
    if (!key) throw new AppError('Invalid file URL format', 400);

    const cmd = new HeadObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const result = await s3Client.send(cmd);

    return {
      key: key,
      size: result.ContentLength,
      type: result.ContentType,
      lastModified: result.LastModified,
      metadata: result.Metadata || {},
    };
  } catch (error) {
    if (error.name === 'NotFound') {
      throw new AppError('File not found', 404);
    }
    console.error('❌ Metadata error:', error.message);
    throw new AppError('Failed to get file metadata', 500);
  }
};

/**
 * Copy file (for versioning)
 */
exports.copyFile = async (sourceUrl, targetKey) => {
  if (!BUCKET || !sourceUrl) {
    throw new AppError('Invalid source URL', 400);
  }

  try {
    const sourceKey = getKeyFromUrl(sourceUrl);
    if (!sourceKey) throw new AppError('Invalid source URL format', 400);

    const cmd = new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `/${BUCKET}/${sourceKey}`,
      Key: targetKey,
      Metadata: {
        copiedFrom: sourceKey,
        copiedAt: new Date().toISOString(),
      },
      MetadataDirective: 'REPLACE',
    });

    const result = await s3Client.send(cmd);

    console.log(`✅ File copied to: ${targetKey}`);

    return getPublicUrl(targetKey);
  } catch (error) {
    console.error('❌ Copy file error:', error.message);
    throw new AppError('Failed to copy file', 500);
  }
};

module.exports = exports;
