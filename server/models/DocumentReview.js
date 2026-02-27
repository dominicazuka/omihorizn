const mongoose = require('mongoose');

const documentReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: { type: String, enum: ['sop', 'cv', 'motivation-letter', 'cover-letter'], required: true },
    documentUrl: { type: String, required: true },
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' },
    status: { type: String, enum: ['submitted', 'in-review', 'completed', 'revision-requested'], default: 'submitted' },
    feedback: String,
    markedUpUrl: String,
    score: Number,
    turnaroundHours: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

documentReviewSchema.index({ userId: 1 });
documentReviewSchema.index({ advisorId: 1 });

module.exports = mongoose.model('DocumentReview', documentReviewSchema);
