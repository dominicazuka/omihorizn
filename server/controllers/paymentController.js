const paymentService = require('../services/paymentService');

/**
 * Get Flutterwave public key and other credentials needed for client-side payment
 * Used by client (web or mobile) to initialize Flutterwave SDK
 */
const getCredentials = async (req, res, next) => {
  try {
    const credentials = await paymentService.getFlutterwaveCredentials();
    res.json({ success: true, credentials });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a payment record before client processes payment
 * Client calls this, gets paymentId and payment details,
 * then uses Flutterwave SDK to process payment with the public key
 */
const create = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const { subscriptionId, amount, currency = 'EUR', description, customer } = req.body;
    const paymentData = await paymentService.createPaymentRecord({
      userId,
      subscriptionId,
      amount,
      currency,
      description,
      customer,
    });
    res.json({ success: true, paymentData });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify payment after client completes Flutterwave transaction
 * Client sends paymentId (from create) and flutterwaveTransactionId (from SDK response)
 * Server verifies with Flutterwave and activates subscription if successful
 */
const verify = async (req, res, next) => {
  try {
    const { paymentId, flutterwaveTransactionId } = req.body;
    const payment = await paymentService.verifyPayment(paymentId, flutterwaveTransactionId);
    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

/**
 * Webhook endpoint for Flutterwave payments and subscriptions.
 * No authentication, uses header signature validation.
 */
const webhook = async (req, res, next) => {
  try {
    const result = await paymentService.handleWebhookEvent(req.headers, req.body);
    res.json(result);
  } catch (err) {
    // return 400 for invalid signature or other webhook errors
    if (err.status === 400) return res.status(400).send(err.message);
    next(err);
  }
};

const status = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentStatus(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

const history = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const payments = await paymentService.getUserPayments(userId);
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
};

/**
 * Get receipt for completed payment
 * Returns formatted receipt data for display or PDF generation
 */
const getReceipt = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const receipt = await paymentService.generateReceipt(paymentId);
    res.json({ success: true, receipt });
  } catch (err) {
    next(err);
  }
};

/**
 * Request refund for a payment
 * Initiates refund process with Flutterwave
 */
const requestRefund = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;
    const payment = await paymentService.requestRefund(paymentId, reason);
    res.json({ success: true, message: 'Refund initiated successfully', payment });
  } catch (err) {
    next(err);
  }
};

/**
 * Retry a failed payment
 * Resets payment status to pending for client to retry
 */
const retry = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const paymentData = await paymentService.retryPayment(paymentId);
    res.json({ success: true, message: 'Payment ready for retry', paymentData });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCredentials, create, verify, webhook, status, history, getReceipt, requestRefund, retry };
