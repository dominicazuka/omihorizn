const settlementService = require('../services/settlementService');

async function getResources(req, res, next) {
  try {
    const { country } = req.params;
    const data = await settlementService.getResources(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getPRTimeline(req, res, next) {
  try {
    const { country } = req.params;
    const data = await settlementService.getPRTimeline(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getSchengen(req, res, next) {
  try {
    const { country } = req.params;
    const data = await settlementService.getSchengenAccess(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function jobMarketAnalysis(req, res, next) {
  try {
    const { country } = req.params;
    const input = req.body;
    const data = await settlementService.jobMarketAnalysis(country, input);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// Admin CRUD
async function createResource(req, res, next) {
  try {
    const data = await settlementService.createResource(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function updateResource(req, res, next) {
  try {
    const data = await settlementService.updateResource(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function deleteResource(req, res, next) {
  try {
    const data = await settlementService.deleteResource(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getResources,
  getPRTimeline,
  getSchengen,
  jobMarketAnalysis,
  createResource,
  updateResource,
  deleteResource,
};