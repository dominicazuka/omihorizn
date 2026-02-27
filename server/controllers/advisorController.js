const advisorService = require('../services/advisorService');

const availableSlots = async (req, res, next) => {
  try {
    const slots = await advisorService.listAvailableSlots();
    res.json({ success: true, data: slots });
  } catch (err) {
    next(err);
  }
};

const bookCall = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const { advisorId, preferredDate, preferredTime, topic } = req.body;
    const booking = await advisorService.bookCall({ userId, advisorId, preferredDate, preferredTime, topic });
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user's scheduled advisor calls
 */
const getMyCalls = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const calls = await advisorService.getUserCalls(userId);
    res.json({ success: true, calls });
  } catch (err) {
    next(err);
  }
};

/**
 * Reschedule an existing advisor call
 */
const rescheduleCall = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { preferredDate, preferredTime } = req.body;
    const call = await advisorService.rescheduleCall(callId, preferredDate, preferredTime);
    res.json({ success: true, call });
  } catch (err) {
    next(err);
  }
};

/**
 * Add discussion topics/notes before call
 */
const addCallNotes = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { notes, topics } = req.body;
    const call = await advisorService.addCallNotes(callId, notes, topics);
    res.json({ success: true, call });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark call as completed and add post-call notes
 */
const completeCall = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { feedback, summary, rating } = req.body;
    const call = await advisorService.completeCall(callId, feedback, summary, rating);
    res.json({ success: true, call });
  } catch (err) {
    next(err);
  }
};

/**
 * Get call history for user
 */
const getCallHistory = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const history = await advisorService.getUserCallHistory(userId);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

/**
 * Get advisor profile with credentials
 */
const getAdvisorProfile = async (req, res, next) => {
  try {
    const { advisorId } = req.params;
    const profile = await advisorService.getAdvisorProfile(advisorId);
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

module.exports = { availableSlots, bookCall, getMyCalls, rescheduleCall, addCallNotes, completeCall, getCallHistory, getAdvisorProfile };
