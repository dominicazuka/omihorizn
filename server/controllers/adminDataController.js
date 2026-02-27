const adminDataService = require('../services/adminDataService');

async function importData(req, res, next) {
  try {
    const { model } = req.params;
    const records = req.body.records;
    const data = await adminDataService.bulkImport(model, records);
    res.status(201).json({ success: true, imported: data.length, data });
  } catch (error) {
    next(error);
  }
}

async function exportData(req, res, next) {
  try {
    const { model } = req.params;
    const data = await adminDataService.exportData(model);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { importData, exportData };
