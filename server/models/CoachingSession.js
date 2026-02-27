const mongoose = require('mongoose');

const coachingSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    videoLink: String,
    status: { type: String, enum: ['scheduled', 'started', 'completed', 'cancelled'], default: 'scheduled' },
    questions: [String],
    feedback: String,
    score: Number,
    recordingUrl: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

coachingSessionSchema.index({ userId: 1 });
coachingSessionSchema.index({ coachId: 1 });

module.exports = mongoose.model('CoachingSession', coachingSessionSchema);
