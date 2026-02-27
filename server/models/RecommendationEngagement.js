/**
 * RecommendationEngagement Model
 * Tracks when a user interacts with a university recommendation (click/view/save)
 */

const mongoose = require('mongoose');

const recommendationEngagementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // anonymous users allowed
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    action: {
      type: String,
      enum: ['click', 'view', 'save'],
      default: 'click',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecommendationEngagement', recommendationEngagementSchema);
