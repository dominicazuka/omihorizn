const mongoose = require('mongoose');

const NewsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'unsubscribed', 'bounced'],
      default: 'pending',
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    unsubscribeDate: {
      type: Date,
      default: null,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly',
    },
    unsubscribeToken: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    categories: {
      type: [String],
      default: ['visa-guides', 'study-abroad', 'immigration-news', 'career-tips'],
    },
  },
  { timestamps: true }
);

NewsletterSubscriberSchema.index({ email: 1 });
NewsletterSubscriberSchema.index({ status: 1 });
NewsletterSubscriberSchema.index({ user: 1 });

module.exports = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
