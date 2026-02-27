const mongoose = require('mongoose');

const settlementResourceSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  category: { type: String, enum: ['housing', 'healthcare', 'education', 'jobs', 'transport', 'other'] },
  name: String,
  description: String,
  link: String,
  relevanceScore: Number,
});

settlementResourceSchema.index({ countryId: 1, category: 1 });

module.exports = mongoose.model('SettlementResource', settlementResourceSchema);
