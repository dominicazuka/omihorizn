const mongoose = require('mongoose');

const labourShortageSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  occupationCode: String,
  occupationName: String,
  demandLevel: { type: String, enum: ['high', 'medium', 'low'] },
  salaryRange: String,
  educationRequirements: String,
  updatedAt: Date,
});

labourShortageSchema.index({ countryId: 1, occupationCode: 1 });

module.exports = mongoose.model('LabourShortage', labourShortageSchema);
