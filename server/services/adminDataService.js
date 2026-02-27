const { AppError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

// generic import by model name
async function bulkImport(modelName, records) {
  if (!Array.isArray(records)) {
    throw new AppError('Records should be an array', 400);
  }
  let Model;
  try {
    Model = mongoose.model(modelName);
  } catch (err) {
    throw new AppError('Invalid model name', 400);
  }
  return Model.insertMany(records);
}

async function exportData(modelName) {
  let Model;
  try {
    Model = mongoose.model(modelName);
  } catch (err) {
    throw new AppError('Invalid model name', 400);
  }
  return Model.find({});
}

module.exports = { bulkImport, exportData };
