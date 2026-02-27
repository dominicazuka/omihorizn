const mongoose = require('mongoose');

const studentLifeResourceSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    default: null,
  },
  resourceType: String, // registration, clubs, transport, etc.
  description: String,
  links: [String],
  contacts: [String],
  keyInfo: String,
});

studentLifeResourceSchema.index({ countryId: 1, universityId: 1, resourceType: 1 });

module.exports = mongoose.model('StudentLifeResource', studentLifeResourceSchema);
