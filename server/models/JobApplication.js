/**
 * JobApplication Model
 * Stores job applications from users
 */

const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    // References
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Application Documents
    cvUrl: {
      type: String,
      required: true,
    },
    coverLetterUrl: {
      type: String,
      default: null,
    },
    portfolioUrl: {
      type: String,
      default: null,
    },
    certificationsUrl: {
      type: [String],
      default: [],
    },

    // Additional Info
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    applicantPhone: {
      type: String,
      default: null,
    },

    // Application Status
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected', 'hired', 'interview'],
      default: 'pending',
      index: true,
    },

    // Admin Notes & Feedback
    adminNotes: {
      type: String,
      default: null,
    },
    internalRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedbackMessage: {
      type: String,
      default: null,
    },

    // Timestamps
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
jobApplicationSchema.index({ jobPostingId: 1, userId: 1 }, { unique: true });
jobApplicationSchema.index({ jobPostingId: 1, status: 1 });
jobApplicationSchema.index({ userId: 1, appliedAt: -1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
