
/**
 * recommendationService.js
 * Handles university recommendation logic using embeddings and vector search.
 */

const AIService = require('./AIService');
const University = require('../models/University');
const Program = require('../models/Program');
const RecommendationEngagement = require('../models/RecommendationEngagement');

/**
 * Recommend universities based on user profile and optional filters.
 * @param {Object} params { userProfile, filters, budget }
 */
const recommendUniversities = async (params) => {
  const {
    userProfile,
    filters = {},
    budget,
    academicFit,
    costFit,
    locationPref,
    programAvailability,
  } = params;

  // generate embedding for profile
  const embedding = await AIService.generateEmbedding(userProfile);

  // cost fit - if user wants the cheapest options under budget
  if (costFit && budget) {
    filters.annualPrice = { $lte: budget };
  }

  // location preference (country or city)
  if (locationPref) {
    // allow either country or city match
    filters.$or = [{ country: locationPref }, { city: locationPref }];
  }

  // academic fit - filter universities by programs matching GPA requirement
  if (academicFit && params.gpa) {
    const progs = await Program.find({ minimumGPA: { $lte: params.gpa } }).select('universityId').lean();
    const uniIds = [...new Set(progs.map(p => p.universityId.toString()))];
    if (uniIds.length) {
      filters._id = filters._id || {};
      filters._id.$in = uniIds;
    } else {
      // no programs meet criteria; return empty early
      return [];
    }
  }

  // program availability - ensure university has at least one upcoming program
  if (programAvailability) {
    const now = new Date();
    const progs = await Program.find({
      universityId: { $exists: true },
      $or: [
        { applicationDeadline: { $gte: now } },
        { intakeMonths: { $in: [now.getMonth() + 1] } },
      ],
    }).select('universityId').lean();
    const uniIds = [...new Set(progs.map(p => p.universityId.toString()))];
    if (uniIds.length) {
      filters._id = filters._id || {};
      filters._id.$in = filters._id.$in ? filters._id.$in.filter(id => uniIds.includes(id.toString())) : uniIds;
      if (filters._id.$in.length === 0) return [];
    } else {
      return [];
    }
  }

  // perform vector search on University model
  const results = await AIService.vectorSearch('University', embedding, filters, 20);

  // ranking factors: post‑process results and build explanation
  const ranked = results.map((r, idx) => {
    let explanation = 'Matched by embedding similarity';
    const appliedFilters = [];
    if (academicFit) appliedFilters.push('academic fit');
    if (costFit) appliedFilters.push('cost fit');
    if (locationPref) appliedFilters.push('location preference');
    if (programAvailability) appliedFilters.push('program availability');
    if (appliedFilters.length) {
      explanation += ` with ${appliedFilters.join(', ')}`;
    }
    return {
      ...r,
      rank: idx + 1,
      explanation,
    };
  });
  return ranked;
};

// simple persistence for engagement events
const trackEngagement = async (userId, universityId) => {
  const doc = await RecommendationEngagement.create({ userId, universityId });
  return { success: true, record: doc };
};

module.exports = {
  recommendUniversities,
  trackEngagement,
};