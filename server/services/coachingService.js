const CoachingSession = require('../models/CoachingSession');
const University = require('../models/University');

const bookSession = async ({ userId, universityId, preferredDate, preferredTime, focusArea }) => {
  const dt = new Date(preferredDate + 'T' + preferredTime + ':00Z');
  const session = await CoachingSession.create({
    userId,
    universityId,
    scheduledAt: dt,
    questions: [focusArea || ''],
    status: 'scheduled',
    duration: 60, // 1 hour
  });

  // Generate video call link
  session.videoCallLink = `https://meet.omihorizn.com/${session._id}`;
  await session.save();

  return session.populate('universityId coachId');
};

const listUserSessions = async (userId) => {
  return CoachingSession.find({ userId }).populate('universityId coachId').sort({ scheduledAt: -1 }).lean();
};

/**
 * Get available coaching slots from coaches
 */
const getAvailableSlots = async () => {
  // In a real system, this would query coach availability
  // For now return mock data
  return [
    { coach: 'Coach A', availableSlots: ['2024-02-15 10:00', '2024-02-15 14:00', '2024-02-16 11:00'] },
    { coach: 'Coach B', availableSlots: ['2024-02-15 15:00', '2024-02-16 09:00'] },
  ];
};

/**
 * Get interview questions for a session
 */
const getSessionQuestions = async (sessionId) => {
  const session = await CoachingSession.findById(sessionId).populate('universityId').lean();

  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  // Fetch university-specific interview questions
  const questionBank = [
    'Tell us about your academic background and why you chose this field of study.',
    'Why do you want to study at our university?',
    'What are your career goals after graduation?',
    'What are your strengths and how have you developed them?',
    'Describe a challenge you faced and how you overcame it.',
    'How do you handle working in a team?',
    'What do you know about our university and this program?',
    'Where do you see yourself in 5 years?',
  ];

  return {
    sessionId,
    university: session.universityId,
    questions: questionBank,
    focusArea: session.questions?.[0] || 'General Interview Prep',
  };
};

/**
 * Start session and generate video link
 */
const startSession = async (sessionId) => {
  const session = await CoachingSession.findByIdAndUpdate(
    sessionId,
    {
      status: 'in_progress',
      startedAt: new Date(),
      videoCallLink: `https://meet.omihorizn.com/${sessionId}`,
    },
    { new: true }
  ).populate('universityId coachId');

  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  return session;
};

/**
 * Complete session with feedback
 */
const completeSession = async (sessionId, feedback, score, recordingLink) => {
  const session = await CoachingSession.findByIdAndUpdate(
    sessionId,
    {
      status: 'completed',
      feedback,
      score: Math.min(10, Math.max(1, score || 5)), // 1-10 scale
      recordingLink,
      completedAt: new Date(),
    },
    { new: true }
  ).populate('universityId coachId');

  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  return session;
};

/**
 * Get session history (past completed sessions)
 */
const getSessionHistory = async (userId) => {
  return CoachingSession.find({ userId, status: 'completed' })
    .populate('universityId coachId', 'name photo')
    .sort({ completedAt: -1 })
    .lean();
};

/**
 * Get scheduled sessions for a coach
 */
const getCoachSchedule = async (coachId) => {
  return CoachingSession.find({ coachId, status: { $in: ['scheduled', 'in_progress'] } })
    .populate('userId', 'firstName lastName email')
    .populate('universityId', 'name')
    .sort({ scheduledAt: 1 })
    .lean();
};

/**
 * Submit coach feedback for session
 */
const submitCoachFeedback = async (sessionId, feedback, score) => {
  const session = await CoachingSession.findByIdAndUpdate(
    sessionId,
    {
      feedback,
      score: Math.min(10, Math.max(1, score || 5)),
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('userId');

  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  return session;
};

/**
 * Store video recording link
 */
const storeRecordingLink = async (sessionId, recordingLink) => {
  const session = await CoachingSession.findByIdAndUpdate(
    sessionId,
    { recordingLink },
    { new: true }
  ).populate('userId');

  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  return session;
};

module.exports = {
  bookSession,
  listUserSessions,
  getAvailableSlots,
  getSessionQuestions,
  startSession,
  completeSession,
  getSessionHistory,
  getCoachSchedule,
  submitCoachFeedback,
  storeRecordingLink,
};
