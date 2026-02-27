const mongoose = require('mongoose');

const addOnSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true // Price in EUR cents
  }
}, { _id: false });

const pricingPlanSchema = new mongoose.Schema(
  {
    tier: {
      type: String,
      enum: ['free', 'premium', 'professional'],
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    monthlyPrice: {
      type: Number,
      required: true // Price in EUR cents
    },
    annualPrice: {
      type: Number,
      required: true // Price in EUR cents
    },
    features: {
      type: [String],
      default: []
    },
    addOns: [addOnSchema],
    highlighted: {
      type: Boolean,
      default: false
    },
    cta: {
      type: String,
      default: 'Get Started'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
