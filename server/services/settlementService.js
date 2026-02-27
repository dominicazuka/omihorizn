const SettlementResource = require('../models/SettlementResource');
const Country = require('../models/Country');
const { AppError } = require('../middleware/errorHandler');

async function getResources(countryId) {
  return SettlementResource.find({ countryId });
}

async function getPRTimeline(countryId) {
  // Dummy: compute from PREligibility if needed
  return { countryId, timelineYears: 5 };
}

async function getSchengenAccess(countryId) {
  const country = await Country.findById(countryId);
  if (!country) throw new AppError('Country not found', 404);
  return { schengenAccess: country.schengenAccess };
}

async function jobMarketAnalysis(countryId, input) {
  // placeholder uses AIService
  const AIService = require('./AIService');
  const text = `Analyze job market for ${countryId}`;
  const result = await AIService.generateText({ prompt: text });
  return { analysis: result };
}

// Admin CRUD
async function createResource(data) {
  return SettlementResource.create(data);
}
async function updateResource(id, data) {
  const doc = await SettlementResource.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new AppError('Resource not found', 404);
  return doc;
}
async function deleteResource(id) {
  const doc = await SettlementResource.findByIdAndDelete(id);
  if (!doc) throw new AppError('Resource not found', 404);
  return doc;
}

module.exports = {
  getResources,
  getPRTimeline,
  getSchengenAccess,
  jobMarketAnalysis,
  createResource,
  updateResource,
  deleteResource,
};