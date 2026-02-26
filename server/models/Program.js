/**
 * Program Model
 * Stores university program/degree information
 */

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,

    // Program Details
    level: {
      type: String,
      enum: ['bachelor', 'master', 'phd', 'diploma', 'certificate'],
      required: true,
    },
    field: String, // e.g., Computer Science, Business
    duration: Number, // in months
    language: {
      type: String,
      default: 'English',
    },

    // Admission
    applicationDeadline: Date,
    intakeMonths: [Number], // 1-12 for January-December
    tuitionFee: Number, // in EUR
    tuitionCurrency: {
      type: String,
      default: 'EUR',
    },

    // Requirements
    requiredDocs: [String], // e.g., ['IELTS', 'GMAT', 'SOP']
    minimumGPA: Number,
    workExperienceRequired: Number, // in years

    // Statistics
    acceptanceRate: Number,
    avgAcceptedGPA: Number,

    // Metadata
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

programSchema.index({ universityId: 1 });
programSchema.index({ field: 1 });

module.exports = mongoose.model('Program', programSchema);
