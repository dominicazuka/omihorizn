const mongoose = require('mongoose');

const prEligibilitySchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  pathwayType: String, // employment, study, points-based, etc.
  eligibilityCriteria: [String],
  timelineYears: Number, // years to PR from visa start
  postResidencyRequirements: [String],
  livingRequirements: String, // physical presence, etc.
  salaryThreshold: Number,
});

prEligibilitySchema.index({ countryId: 1, pathwayType: 1 });

module.exports = mongoose.model('PREligibility', prEligibilitySchema);
