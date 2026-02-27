/**
 * University Controller
 * Handles HTTP requests for university endpoints
 * Follows MVC pattern: Route → Controller → Service → Model
 */

const universityService = require('../services/universityService');
const AppError = require('../middleware/errorHandler').AppError;

class UniversityController {
  /**
   * GET /api/universities
   * List universities with pagination, search, and filters
   */
  async listUniversities(req, res, next) {
    try {
      const result = await universityService.listUniversities(req.query);

      res.status(200).json({
        success: true,
        message: 'Universities retrieved successfully',
        data: result.universities,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/universities/:id
   * Get university detail with programs
   */
  async getUniversityDetail(req, res, next) {
    try {
      const { id } = req.params;
      const university = await universityService.getUniversityDetail(id);

      res.status(200).json({
        success: true,
        message: 'University retrieved successfully',
        data: university,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/universities/:id/view
   * Increment view count (public endpoint)
   */
  async incrementView(req, res, next) {
    try {
      const { id } = req.params;
      const viewCount = await universityService.incrementViewCount(id);

      res.status(200).json({
        success: true,
        message: 'View counted',
        data: { viewCount },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/universities/search
   * Search universities by text and filters
   */
  async searchUniversities(req, res, next) {
    try {
      const universities = await universityService.searchUniversities(req.query);

      res.status(200).json({
        success: true,
        message: 'Universities search completed',
        data: universities,
        count: universities.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/universities/compare
   * Compare multiple universities
   */
  async compareUniversities(req, res, next) {
    try {
      const { universityIds } = req.body;
      const universities = await universityService.compareUniversities(universityIds);

      res.status(200).json({
        success: true,
        message: 'Universities comparison retrieved',
        data: universities,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/universities/statistics
   * Get universities statistics
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await universityService.getStatistics();

      res.status(200).json({
        success: true,
        message: 'Statistics retrieved',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/universities
   * Create university (admin only)
   */
  async createUniversity(req, res, next) {
    try {
      const university = await universityService.createUniversity(req.body);

      res.status(201).json({
        success: true,
        message: 'University created successfully',
        data: university,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/universities/:id
   * Update university (admin only)
   */
  async updateUniversity(req, res, next) {
    try {
      const { id } = req.params;
      const university = await universityService.updateUniversity(id, req.body);

      res.status(200).json({
        success: true,
        message: 'University updated successfully',
        data: university,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/universities/:id
   * Delete university (admin only)
   */
  async deleteUniversity(req, res, next) {
    try {
      const { id } = req.params;
      await universityService.deleteUniversity(id);

      res.status(200).json({
        success: true,
        message: 'University deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/universities/bulk-import
   * Bulk import universities (admin only)
   */
  async bulkImportUniversities(req, res, next) {
    try {
      const { universities } = req.body;
      const result = await universityService.bulkImportUniversities(universities);

      res.status(200).json({
        success: result.failed === 0,
        message: `Import completed: ${result.successful} successful, ${result.failed} failed`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UniversityController();
