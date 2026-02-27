/**
 * Document Service
 * 
 * MVC Layer: Business Logic Handler for Documents
 * Responsibility: Document CRUD, verification, templates, AI generation
 * Flow: Controller → Service → Model → Database
 */

const Document = require('../models/Document');
const { AppError } = require('../middleware/errorHandler');

// Document templates library
const DOCUMENT_TEMPLATES = {
  resume: {
    type: 'resume',
    title: 'Professional Resume',
    description: 'Standard resume/CV template for university applications',
    sections: ['contact', 'summary', 'experience', 'education', 'skills'],
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 8.5in;">
        <h1>[Your Name]</h1>
        <p>[Your Email] | [Your Phone] | [LinkedIn]</p>
        <hr>
        <h2>Professional Summary</h2>
        <p>[2-3 lines about your professional background]</p>
        <h2>Experience</h2>
        <ul>
          <li><strong>[Job Title]</strong> at [Company] ([Dates])<br>[Description]</li>
        </ul>
        <h2>Education</h2>
        <ul>
          <li><strong>[Degree]</strong> from [University] ([Year])</li>
        </ul>
        <h2>Skills</h2>
        <p>[Skills separated by commas]</p>
      </div>
    `,
  },
  sop: {
    type: 'sop',
    title: 'Statement of Purpose',
    description: 'SOP template for masters/PhD applications',
    sections: ['introduction', 'background', 'goals', 'why-program', 'conclusion'],
    htmlTemplate: `
      <div style="font-family: Times New Roman, serif; line-height: 1.5;">
        <p>Dear Selection Committee,</p>
        <p>[Paragraph 1: Introduction to your background and aspirations]</p>
        <p>[Paragraph 2: Educational and professional background]</p>
        <p>[Paragraph 3: Why you're interested in this specific program]</p>
        <p>[Paragraph 4: Your future goals and how program aligns]</p>
        <p>[Paragraph 5: Closing statement]</p>
        <p>Sincerely,<br>[Your Name]</p>
      </div>
    `,
  },
  cover_letter: {
    type: 'cover_letter',
    title: 'Cover Letter',
    description: 'Cover letter template for visa/scholarship applications',
    sections: ['header', 'opening', 'body', 'closing'],
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif;">
        <p>[Your Address]<br>[Date]</p>
        <p>[Recipient Name/University Name]<br>[Address]</p>
        <p>Dear [Recipient],</p>
        <p>[Opening paragraph with your interest]</p>
        <p>[Body paragraph with relevant achievements]</p>
        <p>[Closing paragraph with call to action]</p>
        <p>Sincerely,<br>[Your Name]</p>
      </div>
    `,
  },
  recommendation_letter: {
    type: 'recommendation_letter',
    title: 'Recommendation Letter',
    description: 'Guide for requesting recommendation letters',
    sections: ['request', 'guidance', 'submission'],
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif;">
        <h3>How to Request a Recommendation Letter</h3>
        <ol>
          <li>Identify 2-3 recommenders who know your work well</li>
          <li>Prepare a summary of your achievements and program goals</li>
          <li>Give recommenders at least 2 weeks notice</li>
          <li>Provide them with application details and submission instructions</li>
          <li>Follow up a week before deadline</li>
        </ol>
      </div>
    `,
  },
  transcript: {
    type: 'transcript',
    title: 'Academic Transcript',
    description: 'Official academic transcript from previous institution',
    sections: ['courses', 'grades', 'gpa'],
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif;">
        <h2>[University Name] - Academic Transcript</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px;">Course</th>
              <th style="border: 1px solid #000; padding: 8px;">Grade</th>
              <th style="border: 1px solid #000; padding: 8px;">Credits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 8px;">[Course Name]</td>
              <td style="border: 1px solid #000; padding: 8px;">[Grade]</td>
              <td style="border: 1px solid #000; padding: 8px;">[Credits]</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
};

/**
 * Create document record
 */
exports.createDocument = async ({
  userId,
  applicationId,
  documentType,
  title,
  fileUrl,
  fileName,
  fileSize,
  mimeType,
  isAiGenerated = false,
  generatedAt = null,
}) => {
  const document = new Document({
    userId,
    applicationId,
    documentType,
    title,
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    isAiGenerated,
    generatedAt,
    uploadedAt: new Date(),
    versions: [
      {
        versionNumber: 1,
        uploadedAt: new Date(),
        fileUrl,
        fileName,
      },
    ],
  });

  await document.save();
  return document;
};

/**
 * Get user's documents with filters
 */
exports.getUserDocuments = async (
  userId,
  { applicationId, documentType } = {}
) => {
  const query = { userId };

  if (applicationId) {
    query.applicationId = applicationId;
  }
  if (documentType) {
    query.documentType = documentType;
  }

  const documents = await Document.find(query).sort({ uploadedAt: -1 }).lean();

  return documents;
};

/**
 * Get single document
 */
exports.getDocument = async (documentId, userId) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  return document;
};

/**
 * Update document metadata
 */
exports.updateDocument = async (documentId, userId, updateData) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    return null;
  }

  // Allowed fields to update
  const allowedFields = ['title', 'documentType', 'notes', 'tags'];

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      document[key] = updateData[key];
    }
  });

  document.updatedAt = new Date();
  await document.save();

  return document;
};

/**
 * Delete document
 */
exports.deleteDocument = async (documentId, userId) => {
  const result = await Document.findOneAndDelete({
    _id: documentId,
    userId,
  });

  return result !== null;
};

/**
 * Get template by type
 */
exports.getTemplate = async (documentType) => {
  const template = DOCUMENT_TEMPLATES[documentType];

  if (!template) {
    return null;
  }

  return template;
};

/**
 * List all available templates
 */
exports.listTemplates = async () => {
  return Object.values(DOCUMENT_TEMPLATES).map((template) => ({
    type: template.type,
    title: template.title,
    description: template.description,
    sections: template.sections,
  }));
};

/**
 * Verify document completeness and quality
 */
exports.verifyDocument = async (documentId) => {
  const document = await Document.findById(documentId).lean();

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  // Basic verification checks
  const verification = {
    documentId: document._id,
    documentType: document.documentType,
    checks: {
      filePresent: !!document.fileUrl,
      titlePresent: !!document.title && document.title.length > 0,
      fileSizeValid: document.fileSize && document.fileSize < 50 * 1024 * 1024, // < 50MB
      mimeTypeValid: isValidMimeType(document.mimeType),
    },
    isComplete: true,
    issues: [],
  };

  // Check for issues
  if (!verification.checks.filePresent) {
    verification.issues.push('File not found');
    verification.isComplete = false;
  }
  if (!verification.checks.titlePresent) {
    verification.issues.push('Document title is missing');
    verification.isComplete = false;
  }
  if (!verification.checks.fileSizeValid) {
    verification.issues.push('File size exceeds maximum limit (50MB)');
    verification.isComplete = false;
  }
  if (!verification.checks.mimeTypeValid) {
    verification.issues.push('Invalid file format');
    verification.isComplete = false;
  }

  return verification;
};

/**
 * Get documents for an application
 */
exports.getApplicationDocuments = async (applicationId, userId) => {
  const documents = await Document.find({
    applicationId,
    userId,
  })
    .sort({ uploadedAt: -1 })
    .lean();

  return documents;
};

/**
 * Create document version (when file is replaced)
 */
exports.createDocumentVersion = async (
  documentId,
  userId,
  newFileUrl,
  fileName
) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    return null;
  }

  // Get next version number
  const nextVersion = (document.versions.length || 0) + 1;

  // Add new version
  document.versions.push({
    versionNumber: nextVersion,
    uploadedAt: new Date(),
    fileUrl: newFileUrl,
    fileName,
  });

  // Update main file reference
  document.fileUrl = newFileUrl;
  document.fileName = fileName;
  document.updatedAt = new Date();

  await document.save();

  return document;
};

/**
 * Get document version history
 */
exports.getDocumentVersions = async (documentId, userId) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  }).lean();

  if (!document) {
    return null;
  }

  return document.versions || [];
};

/**
 * Restore document to previous version
 */
exports.restoreDocumentVersion = async (documentId, userId, versionNumber) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    return null;
  }

  const version = document.versions.find((v) => v.versionNumber === versionNumber);

  if (!version) {
    throw new AppError('Version not found', 404);
  }

  // Restore to this version
  document.fileUrl = version.fileUrl;
  document.fileName = version.fileName;
  document.updatedAt = new Date();

  await document.save();

  return document;
};

/**
 * Helper function to validate MIME types
 */
function isValidMimeType(mimeType) {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  return validTypes.includes(mimeType);
}
