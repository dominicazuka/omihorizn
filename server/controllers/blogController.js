const BlogService = require('../services/blogService');

/**
 * Create a new blog post (Admin/Moderator) - validation done at route level
 */
const createBlog = async (req, res, next) => {
  try {
    const blog = await BlogService.createBlogPost(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Blog post created',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all blog posts (public)
 */
const listBlogs = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status, category, tag, search, sort } = req.query;

    const result = await BlogService.listBlogPosts(
      parseInt(page),
      parseInt(pageSize),
      { status, category, tag, search, sort }
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
 * Get blog post by slug (public)
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await BlogService.getBlogBySlug(slug);

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blog post by ID
 */
const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await BlogService.getBlogById(id);

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog post (Author or Admin) - validation done at route level
 */
const updateBlog = async (req, res, next) => {
  try {
    const blog = await BlogService.updateBlogPost(req.params.id, req.body, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Blog post updated',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete blog post (Author or Admin)
 */
const deleteBlog = async (req, res, next) => {
  try {
    const result = await BlogService.deleteBlogPost(req.params.id, req.user.id, req.user.role === 'admin');

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Increment view count
 */
const incrementViewCount = async (req, res, next) => {
  try {
    const { slug } = req.params;
    await BlogService.incrementViewCount(slug);

    res.status(200).json({
      success: true,
      message: 'View count incremented',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blogs by category
 */
const getBlogsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await BlogService.getBlogsByCategory(category, parseInt(page), parseInt(pageSize));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blogs by tag
 */
const getBlogsByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await BlogService.getBlogsByTag(tag, parseInt(page), parseInt(pageSize));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search blogs
 */
const searchBlogs = async (req, res, next) => {
  try {
    const { q } = req.query;
    const { page = 1, pageSize = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const result = await BlogService.searchBlogs(q, parseInt(page), parseInt(pageSize));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  listBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  incrementViewCount,
  getBlogsByCategory,
  getBlogsByTag,
  searchBlogs,
};
