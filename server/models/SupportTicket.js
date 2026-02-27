const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['visa-question', 'application-help', 'technical', 'billing', 'other'], required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [String],
    status: { type: String, enum: ['open', 'in-progress', 'waiting-customer', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slaResponseHours: Number,
    slaBreached: { type: Boolean, default: false },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        attachment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

supportTicketSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
