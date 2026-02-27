const documentReviewService = require('../services/documentReviewService');

const submitReview = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const { documentType, documentUrl, specialInstructions } = req.body;
    const review = await documentReviewService.submitReview({ userId, documentType, documentUrl, specialInstructions });
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

const status = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await documentReviewService.getStatus(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

const myReviews = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const reviews = await documentReviewService.listUserReviews(userId);
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

/**
 * Download reviewed document with comments
 */
const downloadReviewedDocument = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const document = await documentReviewService.getReviewedDocument(reviewId);
    res.json({ success: true, document });
  } catch (err) {
    next(err);
  }
};

/**
 * Request revision on reviewed document
 */
const requestRevision = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { revisionNotes } = req.body;
    const review = await documentReviewService.requestRevision(reviewId, revisionNotes);
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

/**
 * Resubmit revised document for re-review
 */
const resubmitDocument = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { revisedDocumentUrl } = req.body;
    const review = await documentReviewService.resubmitDocument(reviewId, revisedDocumentUrl);
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Get pending reviews for advisor
 */
const getPendingReviews = async (req, res, next) => {
  try {
    const advisorId = req.user && req.user._id;
    const reviews = await documentReviewService.getPendingReviewsForAdvisor(advisorId);
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Complete review with feedback
 */
const completeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { markedUpDocument, feedback, score } = req.body;
    const review = await documentReviewService.completeReview(reviewId, markedUpDocument, feedback, score);
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Add feedback to review
 */
const addFeedback = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { feedbackComments } = req.body;
    const review = await documentReviewService.addFeedback(reviewId, feedbackComments);
    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitReview, status, myReviews, downloadReviewedDocument, requestRevision, resubmitDocument, getPendingReviews, completeReview, addFeedback };
