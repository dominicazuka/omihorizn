const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');
const { blogValidators } = require('../validators');
const {
  createBlog,
  listBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  incrementViewCount,
  getBlogsByCategory,
  getBlogsByTag,
  searchBlogs,
} = require('../controllers/blogController');

/**
 * Admin/Moderator Blog Routes (Define specific routes FIRST)
 */

// Create a new blog post (Admin/Moderator)
router.post('/', authenticateToken, requireRole('admin', 'moderator'), blogValidators.createBlog, createBlog);

// Update blog post (Author or Admin)
router.put('/:id', authenticateToken, blogValidators.updateBlog, updateBlog);

// Delete blog post (Author or Admin)
router.delete('/:id', authenticateToken, deleteBlog);

/**
 * Public Blog Routes (Define more general routes AFTER specific ones)
 */

// Search blogs (specific path before generic /:slug)
router.get('/search', optionalAuth, searchBlogs);

// Get blogs by category
router.get('/category/:category', optionalAuth, getBlogsByCategory);

// Get blogs by tag
router.get('/tag/:tag', optionalAuth, getBlogsByTag);

// Increment view count
router.post('/:slug/view', optionalAuth, incrementViewCount);

// Get blog post by slug (most generic, define last)
router.get('/:slug', optionalAuth, getBlogBySlug);

// List all published blogs (generic GET / should be last)
router.get('/', optionalAuth, listBlogs);

module.exports = router;
