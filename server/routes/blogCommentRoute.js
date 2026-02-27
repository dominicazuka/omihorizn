const express = require('express');
const router = express.Router({ mergeParams: true });
const { authenticateToken, requireRole } = require('../middleware/auth');
const { blogCommentValidators } = require('../validators');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  toggleLike,
  getAllCommentsAdmin,
  moderateComment,
  hardDeleteComment,
} = require('../controllers/blogCommentController');

/**
 * Public Blog Comment Routes
 */

// Get approved comments for a blog post
router.get('/', getComments);

/**
 * Authenticated Comment Routes
 */

// Create a comment on a blog post (authenticated users only)
router.post('/', authenticateToken, blogCommentValidators.createComment, createComment);

// Update a comment (author only)
router.put('/:commentId', authenticateToken, blogCommentValidators.updateComment, updateComment);

// Delete a comment (author or admin)
router.delete('/:commentId', authenticateToken, deleteComment);

// Like/unlike a comment
router.post('/:commentId/like', authenticateToken, toggleLike);

/**
 * Admin Comment Moderation Routes
 */

// Get all comments (including pending/rejected) - Admin only
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllCommentsAdmin);

// Approve/reject/spam a comment - Admin only
router.put('/admin/:commentId/moderate', authenticateToken, requireRole('admin'), blogCommentValidators.adminModerateComment, moderateComment);

// Permanently delete a comment - Admin only
router.delete('/admin/:commentId/hard-delete', authenticateToken, requireRole('admin'), hardDeleteComment);

module.exports = router;
