/**
 * Notification Model
 * Stores in-app notifications for users
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Notification Content
    type: {
      type: String,
      enum: [
        'application_status',
        'document_review',
        'payment_confirmation',
        'subscription_renewal',
        'advisor_message',
        'coaching_session',
        'support_response',
        'visa_update',
        'recommendation_request',
        'interview_update',
        'system_alert',
        'feature_announcement',
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },

    // Reference to related entity
    relatedModel: {
      type: String,
      enum: ['Application', 'Document', 'Payment', 'Subscription', 'Interview', null],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Status and Actions
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    actionUrl: {
      type: String,
      default: null,
    },

    // Metadata
    icon: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
notificationSchema.index({ userId: 1, isRead: 1, isArchived: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
