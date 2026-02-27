const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

const createTicket = async ({ userId, category, subject, description, priority, attachmentUrl, userTier }) => {
  const slaMap = { free: 48, premium: 24, professional: 4 };
  const slaResponseHours = slaMap[userTier] || 48;
  const ticket = await SupportTicket.create({
    userId,
    category,
    subject,
    description,
    priority: priority || 'low',
    attachments: attachmentUrl ? [attachmentUrl] : [],
    slaResponseHours,
    status: 'open',
    createdAt: new Date(),
  });

  // Send confirmation email
  const user = await User.findById(userId).select('email firstName');
  if (user) {
    const emailData = emailTemplates.supportTicketConfirmationEmail(
      user.firstName || 'User',
      ticket._id,
      category,
      slaResponseHours
    );
    await sendEmail(user.email, `Support Ticket Created - OmiHorizn`, emailData);
  }

  return ticket;
};

const listTickets = async (userId) => {
  return SupportTicket.find({ userId }).sort({ createdAt: -1 }).lean();
};

const getTicket = async (id) => {
  return SupportTicket.findById(id).populate('userId', 'firstName lastName email').lean();
};

/**
 * User replies to support ticket
 */
const replyToTicket = async (ticketId, message) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      $push: { messages: { from: 'user', text: message, createdAt: new Date() } },
      status: 'awaiting_response',
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('userId');

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  return ticket;
};

/**
 * Update ticket priority
 */
const updateTicketPriority = async (ticketId, priority) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    { priority },
    { new: true }
  ).populate('userId');

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  return ticket;
};

/**
 * Get all open tickets for admin queue (sorted by SLA)
 */
const getAdminTicketQueue = async () => {
  const tickets = await SupportTicket.find({ status: { $in: ['open', 'awaiting_response', 'in progress'] } })
    .populate('userId', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName')
    .lean();

  // Add SLA breach status
  return tickets.map(ticket => ({
    ...ticket,
    slaExpiredAt: new Date(ticket.createdAt.getTime() + ticket.slaResponseHours * 60 * 60 * 1000),
    timeToSLABreach: Math.max(0, new Date(ticket.createdAt.getTime() + ticket.slaResponseHours * 60 * 60 * 1000) - new Date()),
  })).sort((a, b) => a.timeToSLABreach - b.timeToSLABreach); // Sort by urgency
};

/**
 * Assign ticket to support agent
 */
const assignTicket = async (ticketId, agentId) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    { assignedTo: agentId, status: 'in progress' },
    { new: true }
  ).populate('userId').populate('assignedTo', 'firstName lastName');

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  return ticket;
};

/**
 * Agent replies to ticket
 */
const agentReply = async (ticketId, agentId, message) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      $push: { messages: { from: 'agent', text: message, agentId, createdAt: new Date() } },
      status: 'awaiting_user_response',
      lastResponseAt: new Date(),
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('userId').populate('assignedTo');

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  // Send agent reply email to user
  const agent = await User.findById(agentId).select('firstName lastName').lean();
  if (ticket.userId) {
    const emailData = emailTemplates.supportTicketReplyEmail(
      ticket.userId.firstName || 'User',
      ticketId,
      agent?.firstName || 'Support Team',
      message
    );
    await sendEmail(ticket.userId.email, `Support Team Response - Ticket #${ticketId}`, emailData);
  }

  return ticket;
};

/**
 * Resolve support ticket
 */
const resolveTicket = async (ticketId, resolution) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      status: 'resolved',
      resolution,
      resolvedAt: new Date(),
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('userId');

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  return ticket;
};

/**
 * Get SLA compliance metrics
 */
const getSLAMetrics = async () => {
  const allTickets = await SupportTicket.find({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  }).lean();

  const resolved = allTickets.filter(t => t.status === 'resolved');
  const breached = resolved.filter(t => {
    const slaDeadline = new Date(t.createdAt.getTime() + t.slaResponseHours * 60 * 60 * 1000);
    return t.lastResponseAt > slaDeadline;
  });

  const avgResolutionTime =
    resolved.length > 0
      ? resolved.reduce((sum, t) => sum + (t.resolvedAt - t.createdAt), 0) / resolved.length / (1000 * 60 * 60)
      : 0;

  return {
    totalTickets: allTickets.length,
    resolvedTickets: resolved.length,
    breachedSLA: breached.length,
    slaCompliance: ((resolved.length - breached.length) / resolved.length * 100).toFixed(2) + '%',
    avgResolutionHours: avgResolutionTime.toFixed(1),
  };
};

/**
 * Check for SLA breaches (tickets approaching or past SLA deadline)
 */
const checkSLABreaches = async () => {
  const openTickets = await SupportTicket.find({ status: { $in: ['open', 'in progress', 'awaiting_response'] } })
    .populate('userId', 'firstName email')
    .populate('assignedTo', 'firstName')
    .lean();

  const now = new Date();
  const breaches = [];

  openTickets.forEach(ticket => {
    const slaDeadline = new Date(ticket.createdAt.getTime() + ticket.slaResponseHours * 60 * 60 * 1000);
    const timeRemaining = slaDeadline - now;
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      breaches.push({
        ticketId: ticket._id,
        status: 'breached',
        hoursOverdue: Math.abs(hoursRemaining).toFixed(1),
        user: ticket.userId.firstName,
        assignedTo: ticket.assignedTo?.firstName || 'Unassigned',
      });
    } else if (hoursRemaining < 1) {
      breaches.push({
        ticketId: ticket._id,
        status: 'critical',
        hoursRemaining: hoursRemaining.toFixed(1),
        user: ticket.userId.firstName,
        assignedTo: ticket.assignedTo?.firstName || 'Unassigned',
      });
    }
  });

  return breaches;
};

module.exports = {
  createTicket,
  listTickets,
  getTicket,
  replyToTicket,
  updateTicketPriority,
  getAdminTicketQueue,
  assignTicket,
  agentReply,
  resolveTicket,
  getSLAMetrics,
  checkSLABreaches,
};
