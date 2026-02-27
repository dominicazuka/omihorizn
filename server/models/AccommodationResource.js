const mongoose = require('mongoose');

const accommodationResourceSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  city: String,
  platform: String, // Airbnb, Uniplaces, etc.
  link: String,
  averageCostRange: String,
  neighborhoodRecommendations: String,
});

accommodationResourceSchema.index({ countryId: 1, city: 1 });

module.exports = mongoose.model('AccommodationResource', accommodationResourceSchema);
