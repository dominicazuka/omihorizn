const mongoose = require('mongoose');

const dependentVisaSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  visaType: String,
  dependentCategory: { type: String, enum: ['spouse', 'child', 'parent', 'other'] },
  requirements: [String],
  processingTimelineDays: Number,
  cost: Number,
  workAuthorization: Boolean,
  spouseEmploymentOptions: String,
  schoolingForChildren: String,
});

dependentVisaSchema.index({ countryId: 1, visaType: 1, dependentCategory: 1 });

module.exports = mongoose.model('DependentVisa', dependentVisaSchema);
