const PostAcceptanceChecklist = require('../models/PostAcceptanceChecklist');
const AccommodationResource = require('../models/AccommodationResource');
const StudentLifeResource = require('../models/StudentLifeResource');
const { AppError } = require('../middleware/errorHandler');

async function initChecklist(applicationId, items) {
  let checklist = await PostAcceptanceChecklist.findOne({ applicationId });
  if (checklist) throw new AppError('Checklist already exists', 400);
  checklist = await PostAcceptanceChecklist.create({ applicationId, items });
  return checklist;
}

async function getChecklist(applicationId) {
  const checklist = await PostAcceptanceChecklist.findOne({ applicationId });
  if (!checklist) throw new AppError('Checklist not found', 404);
  return checklist;
}

async function markItem(applicationId, itemId, status) {
  const checklist = await PostAcceptanceChecklist.findOne({ applicationId });
  if (!checklist) throw new AppError('Checklist not found', 404);
  const item = checklist.items.id(itemId);
  if (!item) throw new AppError('Item not found', 404);
  item.status = status;
  await checklist.save();
  return checklist;
}

async function getAccommodation(countryId) {
  return AccommodationResource.find({ countryId });
}

async function getStudentLife(countryId) {
  return StudentLifeResource.find({ countryId });
}

async function getPreArrivalGuide(countryId) {
  // could compile based on resources
  return { countryId, guide: 'Pre-arrival guide placeholder' };
}

async function costEstimate(profile) {
  // naive formula
  const base = 1000;
  const multiplier = profile.familySize || 1;
  return { estimatedCost: base * multiplier };
}

module.exports = {
  initChecklist,
  getChecklist,
  markItem,
  getAccommodation,
  getStudentLife,
  getPreArrivalGuide,
  costEstimate,
};