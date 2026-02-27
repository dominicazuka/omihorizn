const BlogCommentService = require('../services/blogCommentService');
const requestIp = require('@supercharge/request-ip');

/**
 * Create a comment on a blog post (validation done at route level)
 */
const createComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content, parentCommentId } = req.body;
    const ipAddress = requestIp.getClientIp(req);
    const userAgent = req.headers['user-agent'];

    const comment = await BlogCommentService.createComment(
      blogId,
      req.user.id,
      content,
      parentCommentId,
      ipAddress,
      userAgent
    );

    res.status(201).json({
      success: true,
      message: 'Comment created and pending approval',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get approved comments for a blog post
 */
const getComments = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { page = 1, pageSize = 10, sort = 'newest' } = req.query;

    const result = await BlogCommentService.getCommentsForBlog(
      blogId,
      parseInt(page),
      parseInt(pageSize),
      sort
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a comment (validation done at route level)
 */
const updateComment = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;
    const { content } = req.body;

    const comment = await BlogCommentService.updateComment(commentId, req.user.id, content);

    res.status(200).json({
      success: true,
      message: 'Comment updated',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a comment (soft delete by user, author/admin only)
 */
const deleteComment = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;

    const result = await BlogCommentService.deleteComment(
      commentId,
      req.user.id,
      req.user.role === 'admin'
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like/unlike a comment
 */
const toggleLike = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;

    const comment = await BlogCommentService.toggleLike(commentId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Like toggled',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all comments (including pending/rejected)
 */
const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;

    const result = await BlogCommentService.getAllCommentsAdmin(
      blogId,
      parseInt(page),
      parseInt(pageSize),
      search
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Approve/reject/spam a comment (validation done at route level)
 */
const moderateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { status, adminNotes } = req.body;

    const comment = await BlogCommentService.moderateComment(commentId, status, adminNotes);

    res.status(200).json({
      success: true,
      message: `Comment ${status}`,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Permanently delete a comment
 */
const hardDeleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const result = await BlogCommentService.hardDeleteComment(commentId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  toggleLike,
  getAllCommentsAdmin,
  moderateComment,
  hardDeleteComment,
};
