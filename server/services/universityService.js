/**
 * University Service
 * Business logic for university management, search, filtering, and ranking
 */

const University = require('../models/University');
const Program = require('../models/Program');
const AppError = require('../middleware/errorHandler').AppError;

class UniversityService {
  /**
   * List all universities with pagination and filters
   * @param {Object} params - Query parameters
   * @param {Number} params.page - Page number (default 1)
   * @param {Number} params.pageSize - Results per page (default 10, max 100)
   * @param {String} params.country - Filter by country
   * @param {String} params.region - Filter by region
   * @param {String} params.search - Search by name
   * @param {String} params.sortBy - Sort field (name, qs_ranking, times_ranking, viewCount)
   * @param {String} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise<Object>} - Paginated universities with total count
   */
  async listUniversities(params) {
    const page = Math.max(1, parseInt(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.pageSize) || 10));
    const skip = (page - 1) * pageSize;

    // Build filter object
    const filter = {};
    if (params.country) filter.country = new RegExp(params.country, 'i');
    if (params.region) filter.region = new RegExp(params.region, 'i');
    if (params.search) {
      filter.$or = [
        { name: new RegExp(params.search, 'i') },
        { description: new RegExp(params.search, 'i') },
        { city: new RegExp(params.search, 'i') },
      ];
    }

    // Sorting
    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const universities = await University.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select('-__v');

    const total = await University.countDocuments(filter);

    return {
      universities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get single university detail with programs
   * @param {String} universityId - University ID
   * @returns {Promise<Object>} - University with programs
   */
  async getUniversityDetail(universityId) {
    // Verify ID format
    if (!universityId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid university ID format', 400);
    }

    const university = await University.findById(universityId);
    if (!university) {
      throw new AppError('University not found', 404);
    }

    // Get programs for this university
    const programs = await Program.find({ universityId })
      .select('-__v')
      .lean();

    return {
      ...university.toObject(),
      programs,
      programCount: programs.length,
    };
  }

  /**
   * Increment view count for university
   * @param {String} universityId - University ID
   * @returns {Promise<Number>} - Updated view count
   */
  async incrementViewCount(universityId) {
    if (!universityId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid university ID format', 400);
    }

    const university = await University.findByIdAndUpdate(
      universityId,
      { $inc: { viewCount: 1 } },
      { new: true, select: 'viewCount' }
    );

    if (!university) {
      throw new AppError('University not found', 404);
    }

    return university.viewCount;
  }

  /**
   * Search universities by text and filters
   * @param {Object} params - Search parameters
   * @param {String} params.q - Search query
   * @param {String} params.country - Filter by country
   * @param {String} params.region - Filter by region
   * @param {Number} params.minRanking - Minimum QS ranking
   * @param {Number} params.maxRanking - Maximum QS ranking
   * @param {Number} params.limit - Results limit (default 20, max 100)
   * @returns {Promise<Array>} - Matching universities
   */
  async searchUniversities(params) {
    const filter = {};

    // Text search
    if (params.q) {
      filter.$or = [
        { name: new RegExp(params.q, 'i') },
        { description: new RegExp(params.q, 'i') },
        { city: new RegExp(params.q, 'i') },
      ];
    }

    // Country and region filters
    if (params.country) {
      filter.country = new RegExp(params.country, 'i');
    }
    if (params.region) {
      filter.region = new RegExp(params.region, 'i');
    }

    // Ranking filters
    if (params.minRanking || params.maxRanking) {
      filter.qs_ranking = {};
      if (params.minRanking) filter.qs_ranking.$gte = parseInt(params.minRanking);
      if (params.maxRanking) filter.qs_ranking.$lte = parseInt(params.maxRanking);
    }

    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));

    const universities = await University.find(filter)
      .sort({ qs_ranking: 1 })
      .limit(limit)
      .select('-__v');

    return universities;
  }

  /**
   * Compare multiple universities
   * @param {Array<String>} universityIds - Array of university IDs
   * @returns {Promise<Array>} - Universities for comparison
   */
  async compareUniversities(universityIds) {
    if (!Array.isArray(universityIds) || universityIds.length === 0) {
      throw new AppError('University IDs array is required', 400);
    }

    if (universityIds.length > 5) {
      throw new AppError('Cannot compare more than 5 universities', 400);
    }

    // Validate all IDs
    const validIds = universityIds.filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    if (validIds.length !== universityIds.length) {
      throw new AppError('Invalid university ID format', 400);
    }

    const universities = await University.find({ _id: { $in: validIds } })
      .select('-__v');

    if (universities.length !== validIds.length) {
      throw new AppError('Some universities not found', 404);
    }

    return universities;
  }

  /**
   * Get university statistics
   * @returns {Promise<Object>} - Statistics summary
   */
  async getStatistics() {
    const stats = await University.aggregate([
      {
        $group: {
          _id: null,
          totalUniversities: { $sum: 1 },
          avgQsRanking: { $avg: '$qs_ranking' },
          totalViews: { $sum: '$viewCount' },
          countriesRepresented: { $addToSet: '$country' },
        },
      },
      {
        $project: {
          _id: 0,
          totalUniversities: 1,
          avgQsRanking: { $round: ['$avgQsRanking', 0] },
          totalViews: 1,
          countriesCount: { $size: '$countriesRepresented' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalUniversities: 0,
        avgQsRanking: 0,
        totalViews: 0,
        countriesCount: 0,
      };
    }

    return stats[0];
  }

  /**
   * Create university (admin only)
   * @param {Object} data - University data
   * @returns {Promise<Object>} - Created university
   */
  async createUniversity(data) {
    // Check for duplicate
    const existing = await University.findOne({ name: data.name });
    if (existing) {
      throw new AppError('University with this name already exists', 409);
    }

    const university = new University(data);
    await university.save();

    return university;
  }

  /**
   * Update university (admin only)
   * @param {String} universityId - University ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated university
   */
  async updateUniversity(universityId, data) {
    if (!universityId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid university ID format', 400);
    }

    // Don't allow name changes if it would create duplicate
    if (data.name) {
      const existing = await University.findOne({
        name: data.name,
        _id: { $ne: universityId },
      });
      if (existing) {
        throw new AppError('University with this name already exists', 409);
      }
    }

    const university = await University.findByIdAndUpdate(
      universityId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!university) {
      throw new AppError('University not found', 404);
    }

    return university;
  }

  /**
   * Delete university (admin only, soft delete)
   * @param {String} universityId - University ID
   * @returns {Promise<void>}
   */
  async deleteUniversity(universityId) {
    if (!universityId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid university ID format', 400);
    }

    const result = await University.findByIdAndDelete(universityId);

    if (!result) {
      throw new AppError('University not found', 404);
    }
  }

  /**
   * Bulk import universities from CSV data
   * @param {Array<Object>} universities - Array of university objects
   * @returns {Promise<Object>} - Import result summary
   */
  async bulkImportUniversities(universities) {
    if (!Array.isArray(universities) || universities.length === 0) {
      throw new AppError('Universities array is required', 400);
    }

    if (universities.length > 1000) {
      throw new AppError('Cannot import more than 1000 universities at once', 400);
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < universities.length; i++) {
      try {
        const uni = universities[i];

        // Validate required fields
        if (!uni.name || !uni.country) {
          throw new Error('Name and country are required');
        }

        // Check for duplicate
        const existing = await University.findOne({ name: uni.name });
        if (existing) {
          throw new Error('University already exists');
        }

        // Create university
        const newUni = new University(uni);
        await newUni.save();
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          name: universities[i].name || 'Unknown',
          error: error.message,
        });
      }
    }

    return results;
  }
}

module.exports = new UniversityService();
