const DocumentReview = require('../models/DocumentReview');

const submitReview = async ({ userId, documentType, documentUrl, specialInstructions }) => {
  const review = await DocumentReview.create({
    userId,
    documentType,
    documentUrl,
    specialInstructions,
    status: 'submitted',
    turnaroundHours: 72,
    submittedAt: new Date(),
  });
  return review;
};

const getStatus = async (reviewId) => {
  return DocumentReview.findById(reviewId).populate('userId advisorId').lean();
};

const listUserReviews = async (userId) => {
  return DocumentReview.find({ userId }).sort({ submittedAt: -1 }).lean();
};

/**
 * Get reviewed document with comments
 */
const getReviewedDocument = async (reviewId) => {
  const review = await DocumentReview.findById(reviewId).lean();

  if (!review) {
    const err = new Error('Review not found');
    err.status = 404;
    throw err;
  }

  if (review.status !== 'completed') {
    const err = new Error('Review is not yet completed');
    err.status = 400;
    throw err;
  }

  return {
    reviewId: review._id,
    originalDocument: review.documentUrl,
    reviewedDocument: review.markedUpDocumentUrl,
    feedback: review.feedback,
    score: review.score,
    completedAt: review.completedAt,
  };
};

/**
 * Request revision on document
 */
const requestRevision = async (reviewId, revisionNotes) => {
  const review = await DocumentReview.findByIdAndUpdate(
    reviewId,
    {
      status: 'revision_requested',
      revisionNotes,
      revisionRequestedAt: new Date(),
    },
    { new: true }
  ).populate('userId advisorId');

  if (!review) {
    const err = new Error('Review not found');
    err.status = 404;
    throw err;
  }

  return review;
};

/**
 * Resubmit revised document
 */
const resubmitDocument = async (reviewId, revisedDocumentUrl) => {
  const review = await DocumentReview.findByIdAndUpdate(
    reviewId,
    {
      status: 'submitted',
      documentUrl: revisedDocumentUrl,
      resubmittedAt: new Date(),
    },
    { new: true }
  ).populate('userId advisorId');

  if (!review) {
    const err = new Error('Review not found');
    err.status = 404;
    throw err;
  }

  return review;
};

/**
 * Get pending reviews for advisor
 */
const getPendingReviewsForAdvisor = async (advisorId) => {
  return DocumentReview.find({ status: { $in: ['submitted', 'in_review'] }, $or: [{ advisorId }, { advisorId: null }] })
    .populate('userId', 'firstName lastName email')
    .sort({ submittedAt: 1 })
    .lean();
};

/**
 * Complete review with marked-up document and feedback
 */
const completeReview = async (reviewId, markedUpDocument, feedback, score) => {
  const review = await DocumentReview.findByIdAndUpdate(
    reviewId,
    {
      status: 'completed',
      markedUpDocumentUrl: markedUpDocument,
      feedback,
      score: Math.min(10, Math.max(1, score || 5)), // 1-10 scale
      completedAt: new Date(),
    },
    { new: true }
  ).populate('userId');

  if (!review) {
    const err = new Error('Review not found');
    err.status = 404;
    throw err;
  }

  return review;
};

/**
 * Add feedback to review
 */
const addFeedback = async (reviewId, feedbackComments) => {
  const review = await DocumentReview.findByIdAndUpdate(
    reviewId,
    {
      feedback: feedbackComments,
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('userId');

  if (!review) {
    const err = new Error('Review not found');
    err.status = 404;
    throw err;
  }

  return review;
};

module.exports = { submitReview, getStatus, listUserReviews, getReviewedDocument, requestRevision, resubmitDocument, getPendingReviewsForAdvisor, completeReview, addFeedback };
