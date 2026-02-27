
/**
 * interviewService.js
 * Business logic for interview preparation AI features.
 */

const AIService = require('./AIService');
const InterviewFeedback = require('../models/InterviewFeedback');

/**
 * Generate interview questions and answers based on university/program and
 * optionally user profile.
 * @param {Object} params { university, program, userProfile, difficulty }
 */
const generatePrep = async (params) => {
  const { university, program, userProfile, difficulty } = params;
  const prompt = `Generate interview questions (difficulty=${difficulty}) for ${program} at ${university}. User profile: ${userProfile}`;
  const questions = await AIService.generateText(prompt);

  return { questions };
};

const generateAnswers = async (questions, userProfile) => {
  const prompt = `Provide suggested answers for these questions: ${questions.join(', ')} using profile: ${userProfile}`;
  const answers = await AIService.generateText(prompt);
  return { answers };
};

const saveFeedback = async (userId, sessionId, feedback) => {
  // persist feedback record
  const doc = await InterviewFeedback.create({ userId, sessionId, feedback });
  return { success: true, record: doc };
};

module.exports = {
  generatePrep,
  generateAnswers,
  saveFeedback,
};
module.exports = {
  generatePrep,
};