const dependentVisaService = require('../services/dependentVisaService');

async function getDependent(req, res, next) {
  try {
    const { country, visaType } = req.params;
    const data = await dependentVisaService.getDependentInfo(country, visaType);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getFamilyRelocation(req, res, next) {
  try {
    const { country } = req.params;
    const data = await dependentVisaService.getFamilyRelocation(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function familyCostEstimate(req, res, next) {
  try {
    const profile = req.body;
    const data = await dependentVisaService.calculateFamilyCost(profile);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// Admin
async function createEntry(req, res, next) {
  try {
    const data = await dependentVisaService.createDependentVisa(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function updateEntry(req, res, next) {
  try {
    const data = await dependentVisaService.updateDependentVisa(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function deleteEntry(req, res, next) {
  try {
    const data = await dependentVisaService.deleteDependentVisa(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDependent,
  getFamilyRelocation,
  familyCostEstimate,
  createEntry,
  updateEntry,
  deleteEntry,
};