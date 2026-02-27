const Advisor = require('../models/Advisor');
const CoachingSession = require('../models/CoachingSession');
const User = require('../models/User');

const listAvailableSlots = async (query = {}) => {
  // For now, return advisors with availability (frontend will handle slot selection)
  return Advisor.find({}).select('name photo specialty availability credentials').lean();
};

const bookCall = async ({ userId, advisorId, preferredDate, preferredTime, topic }) => {
  // Create a coaching session record (booking implementation)
  const dt = new Date(preferredDate + 'T' + preferredTime + ':00Z');
  const session = await CoachingSession.create({
    userId,
    coachId: advisorId,
    scheduledAt: dt,
    questions: [topic || ''],
    status: 'scheduled',
    duration: 60, // 1 hour default
  });

  // Generate video call link (would integrate with Zoom/Google Meet)
  session.videoCallLink = `https://meet.omihorizn.com/${session._id}`;
  await session.save();

  return session.populate('coachId');
};

/**
 * Get user's scheduled advisor calls
 */
const getUserCalls = async (userId) => {
  return CoachingSession.find({ userId, status: { $in: ['scheduled', 'in_progress'] } })
    .populate('coachId', 'name photo specialty')
    .sort({ scheduledAt: 1 })
    .lean();
};

/**
 * Reschedule an existing call
 */
const rescheduleCall = async (callId, preferredDate, preferredTime) => {
  const dt = new Date(preferredDate + 'T' + preferredTime + ':00Z');
  const session = await CoachingSession.findByIdAndUpdate(
    callId,
    { scheduledAt: dt },
    { new: true }
  ).populate('coachId', 'name photo specialty');

  if (!session) {
    const err = new Error('Call not found');
    err.status = 404;
    throw err;
  }

  return session;
};

/**
 * Add pre-call notes and discussion topics
 */
const addCallNotes = async (callId, notes, topics) => {
  const session = await CoachingSession.findByIdAndUpdate(
    callId,
    {
      questions: topics || [],
      notes: notes,
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('coachId', 'name photo specialty');

  if (!session) {
    const err = new Error('Call not found');
    err.status = 404;
    throw err;
  }

  return session;
};

/**
 * Mark call as completed with feedback
 */
const completeCall = async (callId, feedback, summary, rating) => {
  const session = await CoachingSession.findByIdAndUpdate(
    callId,
    {
      status: 'completed',
      feedback,
      summary,
      rating: Math.min(5, Math.max(1, rating || 5)), // 1-5 rating
      completedAt: new Date(),
    },
    { new: true }
  ).populate('coachId', 'name photo specialty');

  if (!session) {
    const err = new Error('Call not found');
    err.status = 404;
    throw err;
  }

  return session;
};

/**
 * Get user's call history (past completed calls)
 */
const getUserCallHistory = async (userId) => {
  return CoachingSession.find({ userId, status: 'completed' })
    .populate('coachId', 'name photo specialty')
    .sort({ completedAt: -1 })
    .lean();
};

/**
 * Get advisor profile with credentials
 */
const getAdvisorProfile = async (advisorId) => {
  const advisor = await Advisor.findById(advisorId)
    .select('name photo specialty credentials bio availability hourlyRate')
    .lean();

  if (!advisor) {
    const err = new Error('Advisor not found');
    err.status = 404;
    throw err;
  }

  // Get advisor's ratings and review count
  const sessions = await CoachingSession.find({ coachId: advisorId, status: 'completed' }).lean();
  const ratings = sessions.filter(s => s.rating).map(s => s.rating);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';

  return {
    ...advisor,
    averageRating: avgRating,
    totalSessions: sessions.length,
    availability: advisor.availability || [],
  };
};

module.exports = { listAvailableSlots, bookCall, getUserCalls, rescheduleCall, addCallNotes, completeCall, getUserCallHistory, getAdvisorProfile };
