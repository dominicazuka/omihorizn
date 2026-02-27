const mongoose = require('mongoose');

const advisorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: String,
    credentials: String,
    specialty: [String],
    bio: String,
    rating: { type: Number, default: 0 },
    availability: [
      {
        day: String,
        from: String,
        to: String,
        timezone: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

advisorSchema.index({ specialty: 1 });

module.exports = mongoose.model('Advisor', advisorSchema);
