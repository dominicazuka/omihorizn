const visaEngineService = require('../services/visaEngineService');

async function skillMatch(req, res, next) {
  try {
    const userId = req.user.id;
    const profile = req.body;
    const data = await visaEngineService.skillMatch(userId, profile);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function feasibility(req, res, next) {
  try {
    const userId = req.user.id;
    const profile = req.body;
    const data = await visaEngineService.feasibility(userId, profile);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function prPathway(req, res, next) {
  try {
    const userId = req.user.id;
    const options = req.body;
    const data = await visaEngineService.prPathway(userId, options);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  skillMatch,
  feasibility,
  prPathway,
};