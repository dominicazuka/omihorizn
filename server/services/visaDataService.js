const VisaRequirement = require('../models/VisaRequirement');
const VisaPathway = require('../models/VisaPathway');
const LabourShortage = require('../models/LabourShortage');
const { AppError } = require('../middleware/errorHandler');

async function getRequirements(countryId, visaType) {
  const query = { countryId };
  if (visaType) query.visaType = visaType;
  return VisaRequirement.find(query);
}

async function getPathways(countryId) {
  return VisaPathway.find({ countryId });
}

async function getLabourShortages(countryId) {
  return LabourShortage.find({ countryId });
}

// Admin CRUD
async function createRequirement(data) {
  return VisaRequirement.create(data);
}
async function updateRequirement(id, data) {
  const req = await VisaRequirement.findByIdAndUpdate(id, data, { new: true });
  if (!req) throw new AppError('Requirement not found', 404);
  return req;
}
async function deleteRequirement(id) {
  const doc = await VisaRequirement.findByIdAndDelete(id);
  if (!doc) throw new AppError('Requirement not found', 404);
  return doc;
}

async function createPathway(data) {
  return VisaPathway.create(data);
}
async function updatePathway(id, data) {
  const doc = await VisaPathway.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new AppError('Pathway not found', 404);
  return doc;
}
async function deletePathway(id) {
  const doc = await VisaPathway.findByIdAndDelete(id);
  if (!doc) throw new AppError('Pathway not found', 404);
  return doc;
}

async function createLabourShortage(data) {
  return LabourShortage.create(data);
}
async function updateLabourShortage(id, data) {
  const doc = await LabourShortage.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new AppError('Labour shortage not found', 404);
  return doc;
}
async function deleteLabourShortage(id) {
  const doc = await LabourShortage.findByIdAndDelete(id);
  if (!doc) throw new AppError('Labour shortage not found', 404);
  return doc;
}

module.exports = {
  getRequirements,
  getPathways,
  getLabourShortages,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  createPathway,
  updatePathway,
  deletePathway,
  createLabourShortage,
  updateLabourShortage,
  deleteLabourShortage,
};
