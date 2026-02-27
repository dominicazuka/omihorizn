const mongoose = require('mongoose');

const visaPathwaySchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  visaType: String, // Student, Work, PR, Digital Nomad, etc.
  requirements: [String],
  timeline: {
    // processing days, PR eligibility from visa start, etc.
    processingDays: Number,
    prEligibilityYears: Number,
  },
  costBreakdown: {
    visaFee: Number,
    livingExpensesEstimate: Number,
    educationCost: Number,
  },
  successRate: Number, // historical approval % by nationality
  rejectionRate: Number, // by nationality
  lastUpdated: Date,
  dataSource: String,
});

visaPathwaySchema.index({ countryId: 1, visaType: 1 });

module.exports = mongoose.model('VisaPathway', visaPathwaySchema);
