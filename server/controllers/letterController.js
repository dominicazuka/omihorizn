
const letterService = require('../services/letterService');

const generateLetter = async (req, res, next) => {
  try {
    const { type, university, program, userProfile, tone } = req.body;
    const doc = await letterService.generateLetter({ type, university, program, userProfile, tone });
    res.json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

const regenerate = async (req, res, next) => {
  try {
    const { docId, options } = req.body;
    const doc = await letterService.regenerateLetter(docId, options);
    res.json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateLetter, regenerate };
