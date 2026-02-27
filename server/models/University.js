/**
 * University Model
 * Stores university information and programs
 */

const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: String,
    city: String,
    website: String,
    logo: String,

    // Rankings
    qs_ranking: Number,
    times_ranking: Number,
    arwu_ranking: Number,

    // Details
    description: String,
    founded: Number,
    studentPopulation: Number,
    facultyCount: Number,

    // Contact
    email: String,
    phone: String,
    admissionsOfficeUrl: String,

    // Metadata
    viewCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

universitySchema.index({ country: 1 });
// `name` has `unique: true` on the field declaration above and therefore
// already creates an index. Avoid a duplicate `schema.index({ name: 1 })`.

module.exports = mongoose.model('University', universitySchema);
