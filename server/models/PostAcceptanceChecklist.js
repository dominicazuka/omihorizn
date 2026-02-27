const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  description: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  dueDate: Date,
  notes: String,
});

const postAcceptanceChecklistSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true,
  },
  items: [checklistItemSchema],
});

postAcceptanceChecklistSchema.index({ applicationId: 1 });

module.exports = mongoose.model('PostAcceptanceChecklist', postAcceptanceChecklistSchema);
