/**
 * InterviewFeedback Model
 * Stores feedback submitted by users after a mock interview session.
 */

const mongoose = require('mongoose');

const interviewFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

interviewFeedbackSchema.index({ userId: 1 });
interviewFeedbackSchema.index({ sessionId: 1 });

module.exports = mongoose.model('InterviewFeedback', interviewFeedbackSchema);
