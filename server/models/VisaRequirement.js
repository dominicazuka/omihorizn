const mongoose = require('mongoose');

const visaRequirementSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  visaType: String,
  nationality: String,
  educationRequirements: String,
  languageRequirements: String,
  workExperienceRequirements: String,
  salaryThresholds: String,
  processingTimeDays: Number,
  visaFee: Number,
  documentChecklist: [String],
});

visaRequirementSchema.index({ countryId: 1, visaType: 1, nationality: 1 });

module.exports = mongoose.model('VisaRequirement', visaRequirementSchema);
