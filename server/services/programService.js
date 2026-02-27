/**
 * Program Service
 * Business logic for program management, search, and filtering
 */

const Program = require('../models/Program');
const University = require('../models/University');
const AppError = require('../middleware/errorHandler').AppError;

class ProgramService {
  /**
   * List all programs with pagination and filters
   * @param {Object} params - Query parameters
   * @param {Number} params.page - Page number (default 1)
   * @param {Number} params.pageSize - Results per page (default 10, max 100)
   * @param {String} params.universityId - Filter by university
   * @param {String} params.field - Filter by field of study
   * @param {String} params.degree - Filter by degree level (bachelor, master, phd)
   * @param {String} params.search - Search by name
   * @returns {Promise<Object>} - Paginated programs with total count
   */
  async listPrograms(params) {
    const page = Math.max(1, parseInt(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.pageSize) || 10));
    const skip = (page - 1) * pageSize;

    // Build filter object
    const filter = {};
    if (params.universityId) {
      if (!params.universityId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Invalid university ID format', 400);
      }
      filter.universityId = params.universityId;
    }
    if (params.field) {
      filter.field = new RegExp(params.field, 'i');
    }
    if (params.degree) {
      if (!['bachelor', 'master', 'phd', 'diploma', 'certificate'].includes(params.degree)) {
        throw new AppError('Invalid degree level', 400);
      }
      filter.level = params.degree;
    }
    if (params.search) {
      filter.$or = [
        { name: new RegExp(params.search, 'i') },
        { description: new RegExp(params.search, 'i') },
        { field: new RegExp(params.search, 'i') },
      ];
    }

    // Execute query
    const programs = await Program.find(filter)
      .populate('universityId', 'name country city')
      .sort({ name: 1 })
      .skip(skip)
      .limit(pageSize)
      .select('-__v');

    const total = await Program.countDocuments(filter);

    return {
      programs,
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
   * Get single program detail
   * @param {String} programId - Program ID
   * @returns {Promise<Object>} - Program with university details
   */
  async getProgramDetail(programId) {
    if (!programId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid program ID format', 400);
    }

    const program = await Program.findById(programId)
      .populate('universityId', 'name country city ranking website')
      .select('-__v');

    if (!program) {
      throw new AppError('Program not found', 404);
    }

    return program;
  }

  /**
   * Get programs by university
   * @param {String} universityId - University ID
   * @returns {Promise<Array>} - Programs for university
   */
  async getProgramsByUniversity(universityId) {
    if (!universityId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid university ID format', 400);
    }

    // Verify university exists
    const university = await University.findById(universityId);
    if (!university) {
      throw new AppError('University not found', 404);
    }

    const programs = await Program.find({ universityId })
      .sort({ name: 1 })
      .select('-__v');

    return programs;
  }

  /**
   * Search programs by text and filters
   * @param {Object} params - Search parameters
   * @param {String} params.q - Search query
   * @param {String} params.field - Filter by field
   * @param {String} params.degree - Filter by degree
   * @param {Number} params.minTuition - Minimum tuition
   * @param {Number} params.maxTuition - Maximum tuition
   * @param {Number} params.limit - Results limit (default 20, max 100)
   * @returns {Promise<Array>} - Matching programs
   */
  async searchPrograms(params) {
    const filter = {};

    // Text search
    if (params.q) {
      filter.$or = [
        { name: new RegExp(params.q, 'i') },
        { description: new RegExp(params.q, 'i') },
        { field: new RegExp(params.q, 'i') },
      ];
    }

    // Field filter
    if (params.field) {
      filter.field = new RegExp(params.field, 'i');
    }

    // Degree filter
    if (params.degree) {
      filter.level = params.degree;
    }

    // Tuition filters
    if (params.minTuition || params.maxTuition) {
      filter.tuitionFee = {};
      if (params.minTuition) filter.tuitionFee.$gte = parseInt(params.minTuition);
      if (params.maxTuition) filter.tuitionFee.$lte = parseInt(params.maxTuition);
    }

    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));

    const programs = await Program.find(filter)
      .populate('universityId', 'name country')
      .sort({ name: 1 })
      .limit(limit)
      .select('-__v');

    return programs;
  }

  /**
   * Get program statistics
   * @returns {Promise<Object>} - Statistics summary
   */
  async getStatistics() {
    const stats = await Program.aggregate([
      {
        $group: {
          _id: null,
          totalPrograms: { $sum: 1 },
          byDegree: {
            $push: {
              degree: '$level',
              count: { $sum: 1 },
            },
          },
          avgTuition: { $avg: '$tuitionFee' },
          fieldsCount: { $addToSet: '$field' },
        },
      },
      {
        $project: {
          _id: 0,
          totalPrograms: 1,
          avgTuition: { $round: ['$avgTuition', 0] },
          fieldsCount: { $size: '$fieldsCount' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalPrograms: 0,
        avgTuition: 0,
        fieldsCount: 0,
      };
    }

    return stats[0];
  }

  /**
   * Create program (admin only)
   * @param {Object} data - Program data
   * @returns {Promise<Object>} - Created program
   */
  async createProgram(data) {
    // Verify university exists
    const university = await University.findById(data.universityId);
    if (!university) {
      throw new AppError('University not found', 404);
    }

    const program = new Program(data);
    await program.save();

    return program.populate('universityId', 'name country');
  }

  /**
   * Update program (admin only)
   * @param {String} programId - Program ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated program
   */
  async updateProgram(programId, data) {
    if (!programId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid program ID format', 400);
    }

    // If universityId is being changed, verify new university exists
    if (data.universityId) {
      const university = await University.findById(data.universityId);
      if (!university) {
        throw new AppError('University not found', 404);
      }
    }

    const program = await Program.findByIdAndUpdate(
      programId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('universityId', 'name country');

    if (!program) {
      throw new AppError('Program not found', 404);
    }

    return program;
  }

  /**
   * Delete program (admin only)
   * @param {String} programId - Program ID
   * @returns {Promise<void>}
   */
  async deleteProgram(programId) {
    if (!programId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid program ID format', 400);
    }

    const result = await Program.findByIdAndDelete(programId);

    if (!result) {
      throw new AppError('Program not found', 404);
    }
  }

  /**
   * Bulk import programs from CSV data
   * @param {Array<Object>} programs - Array of program objects
   * @returns {Promise<Object>} - Import result summary
   */
  async bulkImportPrograms(programs) {
    if (!Array.isArray(programs) || programs.length === 0) {
      throw new AppError('Programs array is required', 400);
    }

    if (programs.length > 2000) {
      throw new AppError('Cannot import more than 2000 programs at once', 400);
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < programs.length; i++) {
      try {
        const prog = programs[i];

        // Validate required fields
        if (!prog.name || !prog.universityId) {
          throw new Error('Name and universityId are required');
        }

        // Verify university exists
        const university = await University.findById(prog.universityId);
        if (!university) {
          throw new Error('University not found');
        }

        // Create program
        const newProg = new Program(prog);
        await newProg.save();
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          name: programs[i].name || 'Unknown',
          error: error.message,
        });
      }
    }

    return results;
  }
}

module.exports = new ProgramService();
