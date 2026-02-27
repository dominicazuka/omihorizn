/**
 * Application Model
 * Tracks user's visa applications to universities/countries
 */

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },

    // Application Status
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under-review', 'interview', 'accepted', 'rejected', 'completed'],
      default: 'draft',
    },

    // Important Dates
    submissionDate: Date,
    decisionDate: Date,
    interviewDate: Date,

    // Application Details
    visaType: String, // Study, Work, PR, etc.
    startDate: Date,
    degreeLevel: String, // Bachelor, Master, PhD

    // Progress Tracking
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedSteps: [String], // List of completed milestone names

    // Documents & Notes
    personalStatement: String,
    additionalNotes: String,

    // Interview Info
    interview: {
      scheduled: { type: Boolean, default: false },
      date: Date,
      time: String,
      platform: String, // Zoom, Teams, In-person
      link: String,
      interviewNotes: String,
      passed: Boolean,
    },

    // Advisor Info
    assignedAdvisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    advisorNotes: String,

    // Visa appointment tracking
    visaAppointmentDate: Date,
    visaDocumentChecklist: [String],

    // Dependent tracking (for family visas)
    dependents: [
      {
        name: String,
        relation: { type: String, enum: ['spouse', 'child', 'parent', 'other'] },
        age: Number,
      },
    ],

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

applicationSchema.index({ userId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ universityId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
