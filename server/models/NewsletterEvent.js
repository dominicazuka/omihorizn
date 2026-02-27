const mongoose = require('mongoose');

const NewsletterEventSchema = new mongoose.Schema(
  {
    newsletter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Newsletter',
      required: true,
    },
    subscriberEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsletterSubscriber',
      default: null,
    },
    eventType: {
      type: String,
      enum: ['sent', 'open', 'click', 'bounce', 'unsubscribe', 'complaint'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    deviceInfo: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet', 'unknown'],
      default: 'unknown',
    },
    emailClient: {
      type: String,
      default: null,
    },
    clickedLink: {
      type: String,
      default: null,
    },
  },
  { timestamps: false }
);

NewsletterEventSchema.index({ newsletter: 1, eventType: 1 });
NewsletterEventSchema.index({ subscriber: 1 });
NewsletterEventSchema.index({ timestamp: -1 });

module.exports = mongoose.model('NewsletterEvent', NewsletterEventSchema);
