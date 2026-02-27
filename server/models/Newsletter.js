const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent', 'cancelled'],
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    sentDate: {
      type: Date,
      default: null,
    },
    recipientFilter: {
      type: String,
      enum: ['all', 'active', 'category-specific'],
      default: 'all',
    },
    selectedCategories: {
      type: [String],
      default: [],
    },
    stats: {
      totalSent: { type: Number, default: 0 },
      openCount: { type: Number, default: 0 },
      clickCount: { type: Number, default: 0 },
      bounceCount: { type: Number, default: 0 },
      unsubscribeCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

NewsletterSchema.index({ status: 1 });
NewsletterSchema.index({ createdBy: 1 });
NewsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', NewsletterSchema);
