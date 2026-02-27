const mongoose = require('mongoose');

const BlogCommentSchema = new mongoose.Schema(
  {
    blogPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogComment',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'spam'],
      default: 'pending',
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    editHistory: [
      {
        content: String,
        editedAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    adminNotes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

BlogCommentSchema.index({ blogPost: 1, status: 1 });
BlogCommentSchema.index({ user: 1 });
BlogCommentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('BlogComment', BlogCommentSchema);
