const BlogComment = require('../models/BlogComment');
const BlogPost = require('../models/BlogPost');
const { AppError } = require('../middleware/errorHandler');
const { redis } = require('./redis');

class BlogCommentService {
  /**
   * Create a comment on a blog post
   */
  static async createComment(blogId, userId, content, parentCommentId = null, ipAddress = null, userAgent = null) {
    // Verify blog exists
    const blog = await BlogPost.findById(blogId);
    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    // Check rate limit: max 5 comments per user per hour
    const rateLimitKey = `blog-comment:${userId}`;
    const commentCount = await redis.incr(rateLimitKey);
    if (commentCount === 1) {
      await redis.expire(rateLimitKey, 3600); // 1 hour TTL
    }

    if (commentCount > 5) {
      throw new AppError('Too many comments. Please try again later.', 429);
    }

    // Sanitize content (remove HTML, trim)
    const sanitizedContent = content.trim().replace(/<[^>]*>/g, '');

    if (sanitizedContent.length < 1 || sanitizedContent.length > 5000) {
      throw new AppError('Comment must be between 1 and 5000 characters', 400);
    }

    // Check for spam patterns
    if (sanitizedContent.match(/https?:\/\/[^\s]+/g) && sanitizedContent.match(/https?:\/\/[^\s]+/g).length > 1) {
      throw new AppError('Comments with multiple links are not allowed', 400);
    }

    // If it's a reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await BlogComment.findById(parentCommentId);
      if (!parentComment || parentComment.blogPost.toString() !== blogId) {
        throw new AppError('Parent comment not found', 404);
      }
    }

    const comment = new BlogComment({
      blogPost: blogId,
      user: userId,
      content: sanitizedContent,
      parentComment: parentCommentId || null,
      status: 'pending',
      ipAddress,
      userAgent,
    });

    await comment.save();
    return comment.populate('user', 'firstName lastName avatar email');
  }

  /**
   * Get approved comments for a blog post
   */
  static async getCommentsForBlog(blogId, page = 1, pageSize = 10, sort = 'newest') {
    const skip = (page - 1) * pageSize;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'most-liked': { likeCount: -1 },
    };

    const comments = await BlogComment.find({ blogPost: blogId, status: 'approved' })
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('user', 'firstName lastName avatar email')
      .lean();

    const total = await BlogComment.countDocuments({ blogPost: blogId, status: 'approved' });

    // Format nested replies
    const commentMap = new Map();
    const rootComments = [];

    for (const comment of comments) {
      commentMap.set(comment._id.toString(), { ...comment, replies: [] });
    }

    for (const comment of comments) {
      if (comment.parentComment) {
        const parent = commentMap.get(comment.parentComment.toString());
        if (parent) {
          parent.replies.push(commentMap.get(comment._id.toString()));
        }
      } else {
        rootComments.push(commentMap.get(comment._id.toString()));
      }
    }

    return {
      comments: rootComments,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Update a comment
   */
  static async updateComment(commentId, userId, content) {
    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Only comment author can update
    if (comment.user.toString() !== userId) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    // Can't edit after 24 hours
    const createdTime = new Date(comment.createdAt).getTime();
    const nowTime = new Date().getTime();
    const hoursDiff = (nowTime - createdTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      throw new AppError('Comments can only be edited within 24 hours', 400);
    }

    // Store previous content in edit history
    if (comment.editHistory) {
      comment.editHistory.push({
        content: comment.content,
        editedAt: new Date(),
      });
    }

    // Sanitize new content
    const sanitizedContent = content.trim().replace(/<[^>]*>/g, '');

    if (sanitizedContent.length < 1 || sanitizedContent.length > 5000) {
      throw new AppError('Comment must be between 1 and 5000 characters', 400);
    }

    comment.content = sanitizedContent;
    comment.updatedAt = new Date();

    await comment.save();
    return comment.populate('user', 'firstName lastName avatar email');
  }

  /**
   * Delete a comment
   */
  static async deleteComment(commentId, userId, isAdmin) {
    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Only comment author or admin can delete
    if (comment.user.toString() !== userId && !isAdmin) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    // Soft delete: mark as deleted
    comment.status = 'rejected';
    comment.content = '[Comment deleted by author]';
    await comment.save();

    return { success: true, message: 'Comment deleted' };
  }

  /**
   * Like/unlike a comment
   */
  static async toggleLike(commentId, userId) {
    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const userIdStr = userId.toString();
    const likedIndex = comment.likedBy.findIndex((id) => id.toString() === userIdStr);

    if (likedIndex === -1) {
      // Add like
      comment.likedBy.push(userId);
      comment.likeCount += 1;
    } else {
      // Remove like
      comment.likedBy.splice(likedIndex, 1);
      comment.likeCount -= 1;
    }

    await comment.save();
    return comment.populate('user', 'firstName lastName avatar email');
  }

  /**
   * Admin: Get all comments (including pending/rejected)
   */
  static async getAllCommentsAdmin(blogId, page = 1, pageSize = 10, search = null) {
    const skip = (page - 1) * pageSize;
    const query = { blogPost: blogId };

    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { 'user.firstName': { $regex: search, $options: 'i' } },
      ];
    }

    const comments = await BlogComment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('user', 'firstName lastName email')
      .lean();

    const total = await BlogComment.countDocuments(query);

    return {
      comments,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Admin: Approve/reject/spam a comment
   */
  static async moderateComment(commentId, status, adminNotes = null) {
    const validStatuses = ['approved', 'rejected', 'spam'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const comment = await BlogComment.findByIdAndUpdate(
      commentId,
      { status, adminNotes },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    return comment;
  }

  /**
   * Admin: Permanently delete a comment
   */
  static async hardDeleteComment(commentId) {
    const comment = await BlogComment.findByIdAndDelete(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    return { success: true, message: 'Comment permanently deleted' };
  }
}

module.exports = BlogCommentService;
