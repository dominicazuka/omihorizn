/**
 * JobPosting Model
 * Stores job postings created by admins
 */

const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },

    // Location
    country: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },

    // Job Details
    category: {
      type: String,
      enum: ['tech', 'finance', 'healthcare', 'education', 'marketing', 'sales', 'legal', 'other'],
      required: true,
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'executive'],
      required: true,
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'temporary'],
      required: true,
    },

    // Compensation
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'USD',
    },

    // Requirements
    skillsRequired: {
      type: [String],
      default: [],
    },
    requiredDocuments: {
      cv: {
        type: Boolean,
        default: true,
      },
      coverLetter: {
        type: Boolean,
        default: false,
      },
      portfolio: {
        type: Boolean,
        default: false,
      },
      certifications: {
        type: Boolean,
        default: false,
      },
    },

    // Timeline
    applicationDeadline: {
      type: Date,
      required: true,
      index: true,
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'closed', 'archived', 'draft'],
      default: 'active',
      index: true,
    },

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },

    // Admin Reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
jobPostingSchema.index({ status: 1, country: 1, city: 1 });
jobPostingSchema.index({ category: 1, experienceLevel: 1 });
jobPostingSchema.index({ applicationDeadline: 1, status: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
