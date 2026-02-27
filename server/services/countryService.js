/**
 * Country Service
 * Business logic for country management, visa information, and guides
 */

const Country = require('../models/Country');
const AppError = require('../middleware/errorHandler').AppError;

class CountryService {
  /**
   * List all countries with optional filters
   * @param {Object} params - Query parameters
   * @param {Number} params.page - Page number (default 1)
   * @param {Number} params.pageSize - Results per page (default 10, max 100)
   * @param {String} params.region - Filter by region
   * @param {String} params.search - Search by name
   * @returns {Promise<Object>} - Paginated countries with total count
   */
  async listCountries(params) {
    const page = Math.max(1, parseInt(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.pageSize) || 10));
    const skip = (page - 1) * pageSize;

    // Build filter object
    const filter = {};
    if (params.region) {
      filter.region = new RegExp(params.region, 'i');
    }
    if (params.search) {
      filter.$or = [
        { name: new RegExp(params.search, 'i') },
        { description: new RegExp(params.search, 'i') },
      ];
    }

    // Execute query
    const countries = await Country.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(pageSize)
      .select('-__v');

    const total = await Country.countDocuments(filter);

    return {
      countries,
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
   * Get single country detail with visa information
   * @param {String} countryId - Country ID or country code
   * @returns {Promise<Object>} - Country with visa details
   */
  async getCountryDetail(countryId) {
    let country;

    // Try to find by ID first, then by code
    if (countryId.match(/^[0-9a-fA-F]{24}$/)) {
      country = await Country.findById(countryId);
    } else {
      country = await Country.findOne({ code: countryId.toUpperCase() });
    }

    if (!country) {
      throw new AppError('Country not found', 404);
    }

    return country;
  }

  /**
   * Get countries by region
   * @param {String} region - Region name
   * @returns {Promise<Array>} - Countries in region
   */
  async getCountriesByRegion(region) {
    const countries = await Country.find({ region: new RegExp(region, 'i') })
      .sort({ name: 1 })
      .select('-__v');

    if (countries.length === 0) {
      throw new AppError('No countries found for this region', 404);
    }

    return countries;
  }

  /**
   * Get visa guide for a country
   * @param {String} countryId - Country ID or code
   * @returns {Promise<Object>} - Visa guide details
   */
  async getVisaGuide(countryId) {
    const country = await this.getCountryDetail(countryId);

    // Extract visa guide information
    const visaGuide = {
      country: country.name,
      countryCode: country.code,
      visaTypes: country.visaTypes || [],
      requirements: {
        study: country.studyVisaRequirements || [],
        work: country.workVisaRequirements || [],
      },
      processingTime: country.visaProcessingTime || 'Contact embassy',
      costBreakdown: country.visaCostBreakdown || {},
      commonIssues: country.commonVisaIssues || [],
      immigrationWebsite: country.immigrationWebsite,
    };

    return visaGuide;
  }

  /**
   * Get visa requirements by nationality
   * @param {String} countryId - Country ID or code
   * @param {String} nationality - Applicant's nationality code
   * @returns {Promise<Object>} - Visa requirements for nationality
   */
  async getVisaRequirements(countryId, nationality) {
    const country = await this.getCountryDetail(countryId);

    // Build requirements object
    const requirements = {
      country: country.name,
      nationality: nationality.toUpperCase(),
      visaTypes: country.visaTypes || [],
      documentation: country.requiredDocuments || {
        passport: 'Valid passport (minimum 6 months validity)',
        qualifications: 'Educational qualifications',
        financialProof: 'Proof of financial capacity',
      },
      processingTime: country.visaProcessingTime || 'Contact embassy',
      fees: country.visaFees || {},
    };

    return requirements;
  }

  /**
   * Get cost of living for a country
   * @param {String} countryId - Country ID or code
   * @returns {Promise<Object>} - Cost of living details
   */
  async getCostOfLiving(countryId) {
    const country = await this.getCountryDetail(countryId);

    const costOfLiving = {
      country: country.name,
      currency: country.currency || 'EUR',
      monthlyEstimate: country.monthlyLivingCost || null,
      breakdown: {
        accommodation: country.accommodationCost || 'Variable',
        food: country.foodCost || 'Variable',
        transport: country.transportCost || 'Variable',
        utilities: country.utilitiesCost || 'Variable',
      },
      notes: country.costOfLivingNotes || 'Prices vary by city and lifestyle',
    };

    return costOfLiving;
  }

  /**
   * Get education system information
   * @param {String} countryId - Country ID or code
   * @returns {Promise<Object>} - Education system details
   */
  async getEducationSystem(countryId) {
    const country = await this.getCountryDetail(countryId);

    const educationSystem = {
      country: country.name,
      educationLevel: country.educationSystem || 'Not specified',
      degreeTypes: country.degreeTypesAvailable || ['Bachelor', 'Master', 'PhD'],
      languageOfInstruction: country.languageOfInstruction || ['English'],
      qualityRanking: country.educationQuality || 'Good',
      universityCount: country.universityCount || 0,
      internationalStudents: country.internationalStudentPercentage || null,
    };

    return educationSystem;
  }

  /**
   * Search countries by text
   * @param {String} query - Search query
   * @returns {Promise<Array>} - Matching countries
   */
  async searchCountries(query) {
    const countries = await Country.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { code: new RegExp(query, 'i') },
        { region: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
      ],
    })
      .limit(20)
      .select('-__v');

    return countries;
  }

  /**
   * Get country statistics
   * @returns {Promise<Object>} - Statistics summary
   */
  async getStatistics() {
    const stats = await Country.aggregate([
      {
        $group: {
          _id: null,
          totalCountries: { $sum: 1 },
          regionCount: { $addToSet: '$region' },
          avgRanking: { $avg: '$internationalRanking' },
        },
      },
      {
        $project: {
          _id: 0,
          totalCountries: 1,
          regionsRepresented: { $size: '$regionCount' },
          avgRanking: { $round: ['$avgRanking', 0] },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalCountries: 0,
        regionsRepresented: 0,
        avgRanking: 0,
      };
    }

    return stats[0];
  }

  /**
   * Create country (admin only)
   * @param {Object} data - Country data
   * @returns {Promise<Object>} - Created country
   */
  async createCountry(data) {
    // Check for duplicate code
    const existing = await Country.findOne({ code: data.code });
    if (existing) {
      throw new AppError('Country with this code already exists', 409);
    }

    const country = new Country(data);
    await country.save();

    return country;
  }

  /**
   * Update country (admin only)
   * @param {String} countryId - Country ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated country
   */
  async updateCountry(countryId, data) {
    if (!countryId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid country ID format', 400);
    }

    // Don't allow code changes if it would create duplicate
    if (data.code) {
      const existing = await Country.findOne({
        code: data.code,
        _id: { $ne: countryId },
      });
      if (existing) {
        throw new AppError('Country with this code already exists', 409);
      }
    }

    const country = await Country.findByIdAndUpdate(
      countryId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!country) {
      throw new AppError('Country not found', 404);
    }

    return country;
  }

  /**
   * Delete country (admin only)
   * @param {String} countryId - Country ID
   * @returns {Promise<void>}
   */
  async deleteCountry(countryId) {
    if (!countryId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid country ID format', 400);
    }

    const result = await Country.findByIdAndDelete(countryId);

    if (!result) {
      throw new AppError('Country not found', 404);
    }
  }

  /**
   * Bulk import countries from CSV data
   * @param {Array<Object>} countries - Array of country objects
   * @returns {Promise<Object>} - Import result summary
   */
  async bulkImportCountries(countries) {
    if (!Array.isArray(countries) || countries.length === 0) {
      throw new AppError('Countries array is required', 400);
    }

    if (countries.length > 500) {
      throw new AppError('Cannot import more than 500 countries at once', 400);
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < countries.length; i++) {
      try {
        const ctry = countries[i];

        // Validate required fields
        if (!ctry.name || !ctry.code) {
          throw new Error('Name and code are required');
        }

        // Check for duplicate code
        const existing = await Country.findOne({ code: ctry.code });
        if (existing) {
          throw new Error('Country already exists');
        }

        // Create country
        const newCountry = new Country(ctry);
        await newCountry.save();
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          name: countries[i].name || 'Unknown',
          error: error.message,
        });
      }
    }

    return results;
  }
}

module.exports = new CountryService();
