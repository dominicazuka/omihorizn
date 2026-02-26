/**
 * Document Model
 * Stores user documents (SOPs, CVs, cover letters, etc.)
 */

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },

    // Document Info
    type: {
      type: String,
      enum: ['sop', 'cv', 'cover-letter', 'motivation-letter', 'financial-proof', 'medium-of-instruction', 'transcript', 'certificate', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,

    // File Info
    fileName: String,
    fileUrl: String, // S3 URL
    fileSize: Number, // in bytes
    mimeType: String,

    // Version Management
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        version: Number,
        fileUrl: String,
        createdAt: Date,
      },
    ],

    // AI Generation (if applicable)
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: String,
    generatedAt: Date,

    // Document Status
    status: {
      type: String,
      enum: ['draft', 'final', 'submitted'],
      default: 'draft',
    },

    // Metadata
    accessCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

documentSchema.index({ userId: 1 });
documentSchema.index({ applicationId: 1 });
documentSchema.index({ type: 1 });

module.exports = mongoose.model('Document', documentSchema);
