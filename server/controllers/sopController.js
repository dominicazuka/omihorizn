
const sopService = require('../services/sopService');

const generateSop = async (req, res, next) => {
  try {
    const { university, program, userProfile, tone } = req.body;
    const doc = await sopService.generateSop({ university, program, userProfile, tone });
    res.json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

const regenerate = async (req, res, next) => {
  try {
    const { docId, options } = req.body;
    const doc = await sopService.regenerateSop(docId, options);
    res.json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

const score = async (req, res, next) => {
  try {
    const { text } = req.body;
    const result = await sopService.scoreSop(text);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateSop, regenerate, score };
