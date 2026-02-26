/**
 * Payment Model
 * Tracks all payment transactions via Flutterwave
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },

    // Payment Info
    amount: {
      type: Number,
      required: true, // In EUR cents
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    description: String,

    // Flutterwave Info
    flutterwaveTransactionId: {
      type: String,
      unique: true,
    },
    flutterwaveReference: String,
    flutterwaveStatus: String,

    // Payment Status
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    // Payment Method
    paymentMethod: {
      type: String,
      enum: ['card', 'bank-transfer', 'mobile-money', 'wallet'],
    },
    cardBrand: String,
    cardLast4: String,

    // Billing Details
    billingName: String,
    billingEmail: String,
    billingPhone: String,

    // Refund Info
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String,

    // Metadata
    ipAddress: String,
    userAgent: String,
    metadata: Object,

    // Dates
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ flutterwaveTransactionId: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
