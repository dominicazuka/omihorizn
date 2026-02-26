/**
 * Country Model
 * Stores visa and immigration information by country
 */

const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    flag: String, // emoji or URL
    region: String, // Europe, Asia, etc.

    // Visa Info
    visaTypes: [
      {
        type: String,
        enum: ['study', 'work', 'pr', 'dependent', 'visit'],
      },
    ],

    // Requirements
    studyVisaRequirements: [String],
    workVisaRequirements: [String],

    // Statistics
    studySuccessRate: Number,
    workSuccessRate: Number,
    prSuccessRate: Number,

    // Details
    description: String,
    immigrationWebsite: String,

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

countrySchema.index({ name: 1 });
countrySchema.index({ code: 1 });

module.exports = mongoose.model('Country', countrySchema);
