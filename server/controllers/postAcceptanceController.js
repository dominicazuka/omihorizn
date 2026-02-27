const postAcceptanceService = require('../services/postAcceptanceService');

async function initChecklist(req, res, next) {
  try {
    const { appId } = req.params;
    const items = req.body.items || [];
    const data = await postAcceptanceService.initChecklist(appId, items);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getChecklist(req, res, next) {
  try {
    const { appId } = req.params;
    const data = await postAcceptanceService.getChecklist(appId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function markItem(req, res, next) {
  try {
    const { appId, itemId } = req.params;
    const { status } = req.body;
    const data = await postAcceptanceService.markItem(appId, itemId, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getAccommodation(req, res, next) {
  try {
    const { country } = req.params;
    const data = await postAcceptanceService.getAccommodation(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getStudentLife(req, res, next) {
  try {
    const { country } = req.params;
    const data = await postAcceptanceService.getStudentLife(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getPreArrival(req, res, next) {
  try {
    const { country } = req.params;
    const data = await postAcceptanceService.getPreArrivalGuide(country);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function costEstimate(req, res, next) {
  try {
    const profile = req.body;
    const data = await postAcceptanceService.costEstimate(profile);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  initChecklist,
  getChecklist,
  markItem,
  getAccommodation,
  getStudentLife,
  getPreArrival,
  costEstimate,
};