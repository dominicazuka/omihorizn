const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Flutterwave = require('flutterwave-node-v3');
const crypto = require('crypto');
const { sendEmail, emailTemplates } = require('../utils/email');

// initialize Flutterwave client with keys from env
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

/**
 * Get Flutterwave credentials for client-side payment processing
 * Client uses these to initialize Flutterwave SDK (web or mobile)
 */
const getFlutterwaveCredentials = async () => {
  return {
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    // Secret key NOT sent to client; verification happens server-side only
  };
};

/**
 * Create payment record
 * Called by client before payment processing starts
 * Returns payment ID to use as reference during payment
 */
const createPaymentRecord = async ({ userId, subscriptionId, amount, currency = 'EUR', description, customer = {} }) => {
  const payment = await Payment.create({
    userId,
    subscriptionId,
    amount,
    currency,
    description,
    status: 'pending',
    billingName: customer.name,
    billingEmail: customer.email,
    billingPhone: customer.phone,
  });

  return {
    paymentId: payment._id,
    tx_ref: `omihorizn_${payment._id}`,
    amount: (amount / 100).toFixed(2), // convert cents to currency value
    currency,
    customer: {
      email: customer.email || '',
      phonenumber: customer.phone || '',
      name: customer.name || '',
    },
    customizations: {
      title: 'OmiHorizn Subscription',
      description: description || 'Subscription payment',
    },
    // include original subscription id in metadata so that webhooks/recurring charges can be linked
    meta: {
      subscriptionId: subscriptionId.toString(),
    },
  };
};

/**
 * Verify payment with Flutterwave
 * Client sends transactionId or flutterwaveReference after payment completes
 * Server verifies the transaction status and updates payment record
 */
const verifyPayment = async (paymentId, flutterwaveTransactionId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const err = new Error('Payment record not found');
    err.status = 404;
    throw err;
  }

  // Verify transaction with Flutterwave API
  let verificationResult;
  try {
    verificationResult = await flw.Transaction.verify({ id: flutterwaveTransactionId });
  } catch (err) {
    const verifyErr = new Error('Failed to verify transaction with Flutterwave');
    verifyErr.status = 400;
    throw verifyErr;
  }

  if (!verificationResult || verificationResult.status !== 'success') {
    const err = new Error('Transaction verification failed');
    err.status = 400;
    throw err;
  }

  // Transaction is valid, update payment record
  const txData = verificationResult.data;
  payment.flutterwaveTransactionId = txData.id;
  payment.flutterwaveReference = txData.tx_ref;
  payment.flutterwaveStatus = txData.status;
  payment.status = txData.status === 'successful' ? 'completed' : txData.status === 'failed' ? 'failed' : 'pending';
  payment.completedAt = payment.status === 'completed' ? new Date() : null;
  payment.paymentMethod = txData.payment_type;
  payment.cardBrand = txData.card?.issuer;
  payment.cardLast4 = txData.card?.last_4chars;
  payment.metadata = txData.metadata || payment.metadata;

  await payment.save();

  // Activate or update subscription on successful payment
  if (payment.status === 'completed') {
    const subscription = await Subscription.findById(payment.subscriptionId);
    if (subscription) {
      // on first successful payment, mark active and possibly create flutterwave recurring subscription
      if (!subscription.flutterwaveSubscriptionId) {
        // if authorization code available, create Flutterwave subscription for recurring charges
        const authCode = txData.authorization?.authorization_code || txData.meta?.authorization_code || txData.meta?.authorization?.authorization_code;
        if (authCode) {
          try {
            const interval = subscription.billingCycle === 'annual' ? 'yearly' : 'monthly';
            const subResp = await flw.Subscription.create({
              customer: {
                email: payment.billingEmail,
                phonenumber: payment.billingPhone,
                name: payment.billingName,
              },
              amount: (payment.amount / 100).toFixed(2),
              currency: payment.currency,
              interval,
              authorization: authCode,
              // carry original tx_ref for reference
              transaction_charge_type: 'subscription',
              tx_ref: txData.tx_ref,
              // metadata passed again in case Flutterwave returns it on subsequent webhooks
              meta: {
                subscriptionId: subscription._id.toString(),
              },
            });
            subscription.flutterwaveSubscriptionId = subResp.data.id;
          } catch (err) {
            console.error('Failed to create Flutterwave recurring subscription:', err.message || err);
          }
        }
      }
      // extend renewal date by billing cycle on every successful charge (initial or recurring)
      const now = new Date();
      const incrementMonths = subscription.billingCycle === 'annual' ? 12 : 1;
      // if renewalDate is in the past or same day, start from now
      const base = subscription.renewalDate && subscription.renewalDate > now ? subscription.renewalDate : now;
      subscription.renewalDate = new Date(base.setMonth(base.getMonth() + incrementMonths));
      subscription.status = 'active';
      subscription.lastPaymentId = payment._id;
      await subscription.save();

      // send payment confirmation email
      if (subscription.userId) {
        const user = await User.findById(subscription.userId).select('email firstName');
        const emailData = emailTemplates.paymentSuccessEmail(
          user.firstName || 'User',
          payment._id,
          payment.amount,
          subscription.tier,
          subscription.renewalDate
        );
        await sendEmail(user.email, 'Payment Confirmation - OmiHorizn', emailData);
      }
    }
  }

  return payment;

  return payment;
};


const getPaymentStatus = async (paymentId) => {
  return Payment.findById(paymentId).populate('subscriptionId').lean();
};

const getUserPayments = async (userId, filter = {}) => {
  const query = { userId, ...filter };
  return Payment.find(query).populate('subscriptionId').sort({ createdAt: -1 }).lean();
};

/**
 * Generate receipt for completed payment
 * Returns formatted receipt data with transaction details
 */
const generateReceipt = async (paymentId) => {
  const payment = await Payment.findById(paymentId).populate('subscriptionId userId').lean();
  
  if (!payment) {
    const err = new Error('Payment not found');
    err.status = 404;
    throw err;
  }

  if (payment.status !== 'completed') {
    const err = new Error('Only completed payments have receipts');
    err.status = 400;
    throw err;
  }

  const receipt = {
    receiptNumber: `RCP-${payment._id.toString().slice(-8).toUpperCase()}`,
    transactionDate: payment.completedAt,
    paymentId: payment._id,
    flutterwaveTransactionId: payment.flutterwaveTransactionId,
    customer: {
      name: payment.billingName,
      email: payment.billingEmail,
      phone: payment.billingPhone,
    },
    subscription: {
      tier: payment.subscriptionId.tier,
      billingCycle: payment.subscriptionId.billingCycle,
      renewalDate: payment.subscriptionId.renewalDate,
    },
    amount: {
      subtotal: payment.amount,
      currency: payment.currency,
      formatted: `${payment.currency} ${(payment.amount / 100).toFixed(2)}`,
    },
    paymentMethod: {
      type: payment.paymentMethod,
      brand: payment.cardBrand,
      last4: payment.cardLast4,
    },
    status: 'completed',
    description: payment.description || 'Subscription Payment',
  };

  return receipt;
};

/**
 * Request refund for a payment
 * Initiates refund with Flutterwave and updates payment status
 */
const requestRefund = async (paymentId, reason = '') => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    const err = new Error('Payment not found');
    err.status = 404;
    throw err;
  }

  if (payment.status !== 'completed') {
    const err = new Error('Only completed payments can be refunded');
    err.status = 400;
    throw err;
  }

  if (payment.refundStatus === 'refunded' || payment.refundStatus === 'pending_refund') {
    const err = new Error('This payment has already been refunded or refund is pending');
    err.status = 400;
    throw err;
  }

  // Request refund from Flutterwave
  let refundResult;
  try {
    refundResult = await flw.Transaction.refund({ id: payment.flutterwaveTransactionId });
  } catch (err) {
    const refundErr = new Error('Failed to initiate refund with Flutterwave');
    refundErr.status = 400;
    throw refundErr;
  }

  // Update payment status
  payment.refundStatus = 'pending_refund';
  payment.refundRequestedAt = new Date();
  payment.refundReason = reason;
  payment.refundFlutterwaveId = refundResult?.data?.id;

  await payment.save();

  // Cancel subscription if refund initiated
  const subscription = await Subscription.findByIdAndUpdate(
    payment.subscriptionId,
    { status: 'cancelled', cancellationReason: 'refund_requested' },
    { new: true }
  ).populate('userId');

  // Send refund notification email
  if (subscription && subscription.userId) {
    const user = subscription.userId;
    const emailData = emailTemplates.refundInitiatedEmail(
      user.firstName || 'User',
      payment._id,
      (payment.amount / 100).toFixed(2),
      payment.currency
    );
    await sendEmail(user.email, 'Refund Initiated - OmiHorizn', emailData);
  }

  return payment;
};

/**
 * Retry failed payment
 * Used to retry payments that failed due to transient errors
 */
const retryPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    const err = new Error('Payment not found');
    err.status = 404;
    throw err;
  }

  if (payment.status === 'completed') {
    const err = new Error('This payment has already been completed');
    err.status = 400;
    throw err;
  }

  // Reset payment status to pending for retry
  payment.retryCount = (payment.retryCount || 0) + 1;
  if (payment.retryCount > 3) {
    const err = new Error('Maximum retry attempts (3) reached for this payment');
    err.status = 400;
    throw err;
  }

  payment.status = 'pending';
  payment.lastRetryAt = new Date();

  await payment.save();

  return {
    paymentId: payment._id,
    tx_ref: `omihorizn_${payment._id}`,
    amount: (payment.amount / 100).toFixed(2),
    currency: payment.currency,
    retryCount: payment.retryCount,
    message: 'Payment ready for retry',
  };
};

/**
 * Handle incoming Flutterwave webhook events. Verifies signature and
 * processes charge.completed / subscription.charged events by creating
 * or updating payment records and adjusting subscription renewal dates.
 */
const handleWebhookEvent = async (headers, body) => {
  const signature = headers['verif-hash'] || headers['verif_hash'];
  if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
    const err = new Error('Invalid webhook signature');
    err.status = 400;
    throw err;
  }

  const event = body.event;
  const data = body.data;

  if (event === 'charge.completed' || event === 'subscription.charged') {
    let payment = await Payment.findOne({ flutterwaveTransactionId: data.id });
    if (!payment && data.tx_ref) {
      const parts = data.tx_ref.split('_');
      if (parts.length === 2 && mongoose.Types.ObjectId.isValid(parts[1])) {
        payment = await Payment.findById(parts[1]);
      }
    }

    if (!payment && data.meta && data.meta.subscriptionId) {
      const sub = await Subscription.findById(data.meta.subscriptionId);
      if (sub) {
        payment = await Payment.create({
          userId: sub.userId,
          subscriptionId: sub._id,
          amount: Math.round(data.amount * 100),
          currency: data.currency,
          description: data.narration || 'Recurring subscription charge',
          status: 'pending',
          billingName: data.customer?.name,
          billingEmail: data.customer?.email,
          billingPhone: data.customer?.phone_number,
          metadata: data,
        });
      }
    }

    if (payment) {
      await verifyPayment(payment._id, data.id);
    }
  }

  if (event === 'subscription.cancelled' && data.id) {
    const sub = await Subscription.findOne({ flutterwaveSubscriptionId: data.id });
    if (sub) {
      sub.status = 'cancelled';
      sub.cancelledAt = new Date();
      sub.autoRenew = false;
      await sub.save();
    }
  }

  return { success: true };
};

module.exports = {
  getFlutterwaveCredentials,
  createPaymentRecord,
  verifyPayment,
  getPaymentStatus,
  getUserPayments,
  generateReceipt,
  requestRefund,
  retryPayment,
  handleWebhookEvent,
};
