const supportService = require('../services/supportService');

const createTicket = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const userTier = req.user && req.user.subscriptionTier ? req.user.subscriptionTier : 'free';
    const { category, subject, description, priority, attachmentUrl } = req.body;
    const ticket = await supportService.createTicket({ userId, category, subject, description, priority, attachmentUrl, userTier });
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

const listTickets = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const tickets = await supportService.listTickets(userId);
    res.json({ success: true, tickets });
  } catch (err) {
    next(err);
  }
};

const getTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await supportService.getTicket(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * Add reply to support ticket
 */
const replyToTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const ticket = await supportService.replyToTicket(id, message);
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * Update ticket priority
 */
const updatePriority = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const ticket = await supportService.updateTicketPriority(id, priority);
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Get all open tickets sorted by SLA
 */
const getTicketQueue = async (req, res, next) => {
  try {
    const tickets = await supportService.getAdminTicketQueue();
    res.json({ success: true, tickets });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Assign ticket to agent
 */
const assignTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    const ticket = await supportService.assignTicket(id, agentId);
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Add agent response to ticket
 */
const agentReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agentId = req.user && req.user._id;
    const { message } = req.body;
    const ticket = await supportService.agentReply(id, agentId, message);
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Resolve ticket
 */
const resolveTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const ticket = await supportService.resolveTicket(id, resolution);
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Get SLA compliance metrics
 */
const getSLAMetrics = async (req, res, next) => {
  try {
    const metrics = await supportService.getSLAMetrics();
    res.json({ success: true, metrics });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Check SLA breach alerts
 */
const checkSLABreaches = async (req, res, next) => {
  try {
    const breaches = await supportService.checkSLABreaches();
    res.json({ success: true, breaches });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTicket, listTickets, getTicket, replyToTicket, updatePriority, getTicketQueue, assignTicket, agentReply, resolveTicket, getSLAMetrics, checkSLABreaches };
