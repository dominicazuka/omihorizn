/**
 * Program Controller
 * Handles HTTP requests for program endpoints
 * Follows MVC pattern: Route → Controller → Service → Model
 */

const programService = require('../services/programService');
const AppError = require('../middleware/errorHandler').AppError;

class ProgramController {
  /**
   * GET /api/programs
   * List programs with pagination and filters
   */
  async listPrograms(req, res, next) {
    try {
      const result = await programService.listPrograms(req.query);

      res.status(200).json({
        success: true,
        message: 'Programs retrieved successfully',
        data: result.programs,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/programs/:id
   * Get program detail
   */
  async getProgramDetail(req, res, next) {
    try {
      const { id } = req.params;
      const program = await programService.getProgramDetail(id);

      res.status(200).json({
        success: true,
        message: 'Program retrieved successfully',
        data: program,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/universities/:universityId/programs
   * Get programs by university
   */
  async getProgramsByUniversity(req, res, next) {
    try {
      const { universityId } = req.params;
      const programs = await programService.getProgramsByUniversity(universityId);

      res.status(200).json({
        success: true,
        message: 'Programs retrieved successfully',
        data: programs,
        count: programs.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/programs/search
   * Search programs by text and filters
   */
  async searchPrograms(req, res, next) {
    try {
      const programs = await programService.searchPrograms(req.query);

      res.status(200).json({
        success: true,
        message: 'Programs search completed',
        data: programs,
        count: programs.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/programs/statistics
   * Get programs statistics
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await programService.getStatistics();

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
   * POST /api/admin/programs
   * Create program (admin only)
   */
  async createProgram(req, res, next) {
    try {
      const program = await programService.createProgram(req.body);

      res.status(201).json({
        success: true,
        message: 'Program created successfully',
        data: program,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/programs/:id
   * Update program (admin only)
   */
  async updateProgram(req, res, next) {
    try {
      const { id } = req.params;
      const program = await programService.updateProgram(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Program updated successfully',
        data: program,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/programs/:id
   * Delete program (admin only)
   */
  async deleteProgram(req, res, next) {
    try {
      const { id } = req.params;
      await programService.deleteProgram(id);

      res.status(200).json({
        success: true,
        message: 'Program deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/programs/bulk-import
   * Bulk import programs (admin only)
   */
  async bulkImportPrograms(req, res, next) {
    try {
      const { programs } = req.body;
      const result = await programService.bulkImportPrograms(programs);

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

module.exports = new ProgramController();
