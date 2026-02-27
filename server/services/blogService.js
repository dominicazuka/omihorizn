const BlogPost = require('../models/BlogPost');
const { AppError } = require('../middleware/errorHandler');
const { redis } = require('./redis');

class BlogService {
  /**
   * Create a new blog post
   */
  static async createBlogPost(data, authorId) {
    const { title, content, category, tags, featuredImage, metaDescription, metaKeywords, status } = data;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const blog = new BlogPost({
      title,
      slug,
      content,
      category,
      tags: tags || [],
      featuredImage,
      author: authorId,
      metaDescription,
      metaKeywords: metaKeywords || [],
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
    });

    await blog.save();
    return blog.populate('author', 'firstName lastName email');
  }

  /**
   * Get all blog posts with pagination, filtering, and search
   */
  static async listBlogPosts(page = 1, pageSize = 10, filters = {}) {
    const { status = 'published', category, tag, search, sort = 'newest' } = filters;

    const query = { status };
    
    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {
      newest: { publishedAt: -1 },
      oldest: { publishedAt: 1 },
      'most-viewed': { viewCount: -1 },
    };

    const skip = (page - 1) * pageSize;
    const blogs = await BlogPost.find(query)
      .sort(sortOptions[sort] || { publishedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('author', 'firstName lastName email')
      .lean();

    const total = await BlogPost.countDocuments(query);

    return {
      blogs,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get blog post by slug
   */
  static async getBlogBySlug(slug) {
    const blog = await BlogPost.findOne({ slug })
      .populate('author', 'firstName lastName email avatar')
      .lean();

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    // Increment view count (non-blocking)
    BlogPost.updateOne({ _id: blog._id }, { $inc: { viewCount: 1 } }).catch(() => {});

    return blog;
  }

  /**
   * Get blog post by ID
   */
  static async getBlogById(id) {
    const blog = await BlogPost.findById(id)
      .populate('author', 'firstName lastName email avatar');

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    return blog;
  }

  /**
   * Update blog post
   */
  static async updateBlogPost(id, data, userId) {
    const blog = await BlogPost.findById(id);

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    // Only author or admin can update
    if (blog.author.toString() !== userId && !userId.isAdmin) {
      throw new AppError('Not authorized to update this blog post', 403);
    }

    Object.assign(blog, data);

    if (data.title && !data.slug) {
      blog.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    if (data.status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();
    return blog.populate('author', 'firstName lastName email');
  }

  /**
   * Delete blog post
   */
  static async deleteBlogPost(id, userId, isAdmin) {
    const blog = await BlogPost.findById(id);

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    // Only author or admin can delete
    if (blog.author.toString() !== userId && !isAdmin) {
      throw new AppError('Not authorized to delete this blog post', 403);
    }

    await BlogPost.findByIdAndDelete(id);
    return { success: true, message: 'Blog post deleted' };
  }

  /**
   * Increment view count
   */
  static async incrementViewCount(slug) {
    const blog = await BlogPost.findOne({ slug });

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    blog.viewCount += 1;
    await blog.save();
    return blog;
  }

  /**
   * Get blogs by category
   */
  static async getBlogsByCategory(category, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const blogs = await BlogPost.find({ status: 'published', category })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('author', 'firstName lastName email')
      .lean();

    const total = await BlogPost.countDocuments({ status: 'published', category });

    return {
      blogs,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get blogs by tag
   */
  static async getBlogsByTag(tag, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const blogs = await BlogPost.find({ status: 'published', tags: tag })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('author', 'firstName lastName email')
      .lean();

    const total = await BlogPost.countDocuments({ status: 'published', tags: tag });

    return {
      blogs,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Search blogs
   */
  static async searchBlogs(query, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const searchQuery = {
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    };

    const blogs = await BlogPost.find(searchQuery)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('author', 'firstName lastName email')
      .lean();

    const total = await BlogPost.countDocuments(searchQuery);

    return {
      blogs,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }
}

module.exports = BlogService;
