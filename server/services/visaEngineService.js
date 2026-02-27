const { AppError } = require('../middleware/errorHandler');
const User = require('../models/User');
const LabourShortage = require('../models/LabourShortage');
const VisaPathway = require('../models/VisaPathway');
const VisaRequirement = require('../models/VisaRequirement');
const PREligibility = require('../models/PREligibility');

// simple in-memory cache placeholder
const cache = {};

async function ensurePremiumPlus(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  if (user.subscriptionTier !== 'professional' && user.subscriptionTier !== 'premium') {
    // assuming only premium+ allowed (premium or professional)
    throw new AppError('Premium subscription required', 402);
  }
}

async function skillMatch(userId, profile) {
  await ensurePremiumPlus(userId);
  const cacheKey = `skillMatch:${userId}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].ts < 24 * 60 * 60 * 1000) {
    return cache[cacheKey].data;
  }
  // naive implementation: fetch labour shortages and return random score
  const shortages = await LabourShortage.find({});
  const results = shortages.slice(0, 5).map((item) => ({
    countryId: item.countryId,
    occupation: item.occupationName,
    probability: Math.floor(Math.random() * 80) + 10,
    breakdown: { match: 'basic' },
  }));

  const output = { scores: results };
  cache[cacheKey] = { ts: Date.now(), data: output };
  return output;
}

async function feasibility(userId, profile) {
  await ensurePremiumPlus(userId);
  const cacheKey = `feasibility:${userId}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].ts < 7 * 24 * 60 * 60 * 1000) {
    return cache[cacheKey].data;
  }
  // naive placeholder: query visa requirements and assign random bands
  const reqs = await VisaRequirement.find({});
  const results = reqs.slice(0, 5).map((r) => ({
    countryId: r.countryId,
    feasibility: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
    timelineMonths: Math.floor(Math.random() * 12) + 1,
    blockers: [],
  }));
  const output = { results };
  cache[cacheKey] = { ts: Date.now(), data: output };
  return output;
}

async function prPathway(userId, options) {
  await ensurePremiumPlus(userId);
  const cacheKey = `prPathway:${userId}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].ts < 30 * 24 * 60 * 60 * 1000) {
    return cache[cacheKey].data;
  }
  // naive placeholder: fetch pathways
  const paths = await VisaPathway.find({ countryId: options.countryId }).limit(5);
  const output = paths.map((p) => ({
    pathway: p,
    score: Math.random(),
  }));
  cache[cacheKey] = { ts: Date.now(), data: output };
  return output;
}

module.exports = {
  skillMatch,
  feasibility,
  prPathway,
};
