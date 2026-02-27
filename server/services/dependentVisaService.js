const DependentVisa = require('../models/DependentVisa');
const { AppError } = require('../middleware/errorHandler');

async function getDependentInfo(countryId, visaType) {
  return DependentVisa.find({ countryId, visaType });
}

async function getFamilyRelocation(countryId) {
  // simple: return all dependents for country
  return DependentVisa.find({ countryId });
}

async function calculateFamilyCost(profile) {
  // profile contains countryId, familySize, etc
  // placeholder: return static cost
  return {
    countryId: profile.countryId,
    estimatedCost: 10000 * (profile.familySize || 1),
  };
}

// admin CRUD
async function createDependentVisa(data) {
  return DependentVisa.create(data);
}
async function updateDependentVisa(id, data) {
  const doc = await DependentVisa.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new AppError('Dependent visa entry not found', 404);
  return doc;
}
async function deleteDependentVisa(id) {
  const doc = await DependentVisa.findByIdAndDelete(id);
  if (!doc) throw new AppError('Dependent visa entry not found', 404);
  return doc;
}

module.exports = {
  getDependentInfo,
  getFamilyRelocation,
  calculateFamilyCost,
  createDependentVisa,
  updateDependentVisa,
  deleteDependentVisa,
};