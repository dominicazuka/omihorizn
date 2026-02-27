/**
 * Subscription Model
 * Manages user subscription tiers and billing
 */

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Tier Info
    tier: {
      type: String,
      enum: ['free', 'premium', 'professional'],
      default: 'free',
    },

    // Billing
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    amount: {
      type: Number,
      default: 0, // In EUR cents
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    billingEmail: String,

    // Dates
    startDate: {
      type: Date,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    cancelledAt: Date,
    pausedAt: Date,

    // Status
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled', 'expired'],
      default: 'active',
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    // flags to avoid duplicate reminder emails
    reminder7Sent: {
      type: Boolean,
      default: false,
    },
    reminder1Sent: {
      type: Boolean,
      default: false,
    },

    // Features Enabled
    featuresEnabled: [String], // Array of feature keys

    // Payment Info
    lastPaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    failedPaymentAttempts: {
      type: Number,
      default: 0,
    },

    // Promo Code (if applicable)
    promoCode: String,
    discountPercentage: {
      type: Number,
      default: 0,
    },

    // Flutterwave Recurring Subscription ID (if using Flutterwave subscription API)
    flutterwaveSubscriptionId: String,

    // Cancellation Reason
    cancellationReason: String,
    cancellationFeedback: String,

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

subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ renewalDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
