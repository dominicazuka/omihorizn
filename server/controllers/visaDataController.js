const visaDataService = require('../services/visaDataService');

async function getRequirements(req, res, next) {
  try {
    const { country, visaType } = req.params;
    const data = await visaDataService.getRequirements(country, visaType);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getPathways(req, res, next) {
  try {
    const { country } = req.params;
    const data = await visaDataService.getPathways(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getLabourShortages(req, res, next) {
  try {
    const { country } = req.params;
    const data = await visaDataService.getLabourShortages(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// Admin handlers:
async function createVisaData(req, res, next) {
  try {
    const data = await visaDataService.createRequirement(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function updateVisaData(req, res, next) {
  try {
    const id = req.params.id;
    const data = await visaDataService.updateRequirement(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function deleteVisaData(req, res, next) {
  try {
    const id = req.params.id;
    const data = await visaDataService.deleteRequirement(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRequirements,
  getPathways,
  getLabourShortages,
  createVisaData,
  updateVisaData,
  deleteVisaData,
};