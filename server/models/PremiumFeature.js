/**
 * PremiumFeature Model
 * Defines features available by subscription tier
 */

const mongoose = require('mongoose');

const premiumFeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['ai', 'advisor', 'documents', 'visa-engines', 'support', 'other'],
    },

    // Tier Access
    freeAccess: { type: Boolean, default: false },
    premiumAccess: { type: Boolean, default: true },
    professionalAccess: { type: Boolean, default: true },

    // Usage Limits (for tracking)
    freeLimit: Number,
    premiumLimit: Number, // null = unlimited
    professionalLimit: Number, // null = unlimited

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

module.exports = mongoose.model('PremiumFeature', premiumFeatureSchema);
