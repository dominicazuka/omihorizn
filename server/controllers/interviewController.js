
const interviewService = require('../services/interviewService');

const generatePrep = async (req, res, next) => {
  try {
    const { university, program, userProfile, difficulty } = req.body;
    const result = await interviewService.generatePrep({ university, program, userProfile, difficulty });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const generateAnswers = async (req, res, next) => {
  try {
    const { questions, userProfile } = req.body;
    const result = await interviewService.generateAnswers(questions, userProfile);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const saveFeedback = async (req, res, next) => {
  try {
    const { userId, sessionId, feedback } = req.body;
    const result = await interviewService.saveFeedback(userId, sessionId, feedback);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { generatePrep, generateAnswers, saveFeedback };
