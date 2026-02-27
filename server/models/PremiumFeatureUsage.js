/**
 * PremiumFeatureUsage Model
 * Tracks feature usage and limits per user
 */

const mongoose = require('mongoose');

const premiumFeatureUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PremiumFeature',
      required: true,
    },
    featureKey: {
      type: String,
      required: false,
      index: true,
    },

    // Usage Tracking
    usageCount: {
      type: Number,
      default: 0,
    },
    usageLimit: Number,
    resetDate: Date, // When usage counter resets

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Last Used
    lastUsedAt: Date,

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

premiumFeatureUsageSchema.index({ userId: 1, featureId: 1 });
premiumFeatureUsageSchema.index({ resetDate: 1 });

module.exports = mongoose.model('PremiumFeatureUsage', premiumFeatureUsageSchema);
