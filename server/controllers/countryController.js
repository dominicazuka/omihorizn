/**
 * Country Controller
 * Handles HTTP requests for country and visa information endpoints
 * Follows MVC pattern: Route → Controller → Service → Model
 */

const countryService = require('../services/countryService');
const AppError = require('../middleware/errorHandler').AppError;

class CountryController {
  /**
   * GET /api/countries
   * List countries with pagination and filters
   */
  async listCountries(req, res, next) {
    try {
      const result = await countryService.listCountries(req.query);

      res.status(200).json({
        success: true,
        message: 'Countries retrieved successfully',
        data: result.countries,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/:id
   * Get country detail with visa information
   */
  async getCountryDetail(req, res, next) {
    try {
      const { id } = req.params;
      const country = await countryService.getCountryDetail(id);

      res.status(200).json({
        success: true,
        message: 'Country retrieved successfully',
        data: country,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/region/:region
   * Get countries by region
   */
  async getCountriesByRegion(req, res, next) {
    try {
      const { region } = req.params;
      const countries = await countryService.getCountriesByRegion(region);

      res.status(200).json({
        success: true,
        message: 'Countries retrieved successfully',
        data: countries,
        count: countries.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/:id/visa-guide
   * Get visa guide for a country
   */
  async getVisaGuide(req, res, next) {
    try {
      const { id } = req.params;
      const guide = await countryService.getVisaGuide(id);

      res.status(200).json({
        success: true,
        message: 'Visa guide retrieved successfully',
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/:id/visa-requirements
   * Get visa requirements by nationality
   */
  async getVisaRequirements(req, res, next) {
    try {
      const { id } = req.params;
      const { nationality } = req.query;

      if (!nationality) {
        throw new AppError('Nationality query parameter is required', 400);
      }

      const requirements = await countryService.getVisaRequirements(id, nationality);

      res.status(200).json({
        success: true,
        message: 'Visa requirements retrieved successfully',
        data: requirements,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/:id/cost-of-living
   * Get cost of living for a country
   */
  async getCostOfLiving(req, res, next) {
    try {
      const { id } = req.params;
      const costData = await countryService.getCostOfLiving(id);

      res.status(200).json({
        success: true,
        message: 'Cost of living data retrieved successfully',
        data: costData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/:id/education-system
   * Get education system information
   */
  async getEducationSystem(req, res, next) {
    try {
      const { id } = req.params;
      const educationData = await countryService.getEducationSystem(id);

      res.status(200).json({
        success: true,
        message: 'Education system information retrieved successfully',
        data: educationData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/search
   * Search countries by text
   */
  async searchCountries(req, res, next) {
    try {
      const { q } = req.query;

      if (!q) {
        throw new AppError('Search query is required', 400);
      }

      const countries = await countryService.searchCountries(q);

      res.status(200).json({
        success: true,
        message: 'Countries search completed',
        data: countries,
        count: countries.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/statistics
   * Get countries statistics
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await countryService.getStatistics();

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
   * POST /api/admin/countries
   * Create country (admin only)
   */
  async createCountry(req, res, next) {
    try {
      const country = await countryService.createCountry(req.body);

      res.status(201).json({
        success: true,
        message: 'Country created successfully',
        data: country,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/countries/:id
   * Update country (admin only)
   */
  async updateCountry(req, res, next) {
    try {
      const { id } = req.params;
      const country = await countryService.updateCountry(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Country updated successfully',
        data: country,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/countries/:id
   * Delete country (admin only)
   */
  async deleteCountry(req, res, next) {
    try {
      const { id } = req.params;
      await countryService.deleteCountry(id);

      res.status(200).json({
        success: true,
        message: 'Country deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/countries/bulk-import
   * Bulk import countries (admin only)
   */
  async bulkImportCountries(req, res, next) {
    try {
      const { countries } = req.body;
      const result = await countryService.bulkImportCountries(countries);

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

module.exports = new CountryController();
