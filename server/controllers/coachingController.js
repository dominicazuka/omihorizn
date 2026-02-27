const coachingService = require('../services/coachingService');

const bookSession = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const { universityId, preferredDate, preferredTime, focusArea } = req.body;
    const session = await coachingService.bookSession({ userId, universityId, preferredDate, preferredTime, focusArea });
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

const mySessions = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const sessions = await coachingService.listUserSessions(userId);
    res.json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
};

/**
 * Get available coaching slots
 */
const availableSlots = async (req, res, next) => {
  try {
    const slots = await coachingService.getAvailableSlots();
    res.json({ success: true, slots });
  } catch (err) {
    next(err);
  }
};

/**
 * Get interview questions for university preparation
 */
const getInterviewQuestions = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const questions = await coachingService.getSessionQuestions(sessionId);
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

/**
 * Start coaching session and generate video link
 */
const startSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await coachingService.startSession(sessionId);
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

/**
 * Complete session with feedback and score
 */
const completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { feedback, score, recordingLink } = req.body;
    const session = await coachingService.completeSession(sessionId, feedback, score, recordingLink);
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

/**
 * Get session history
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const history = await coachingService.getSessionHistory(userId);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Get scheduled sessions for coach
 */
const getScheduledSessions = async (req, res, next) => {
  try {
    const coachId = req.user && req.user._id;
    const sessions = await coachingService.getCoachSchedule(coachId);
    res.json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Submit feedback for completed session
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { feedback, score } = req.body;
    const session = await coachingService.submitCoachFeedback(sessionId, feedback, score);
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Store video recording link
 */
const storeRecordingLink = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { recordingLink } = req.body;
    const session = await coachingService.storeRecordingLink(sessionId, recordingLink);
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

module.exports = { bookSession, mySessions, availableSlots, getInterviewQuestions, startSession, completeSession, getHistory, getScheduledSessions, submitFeedback, storeRecordingLink };
