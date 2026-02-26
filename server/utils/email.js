/**
 * Email Utilities
 * Handles email validation and template rendering
 */

const nodemailer = require('nodemailer');

// Email transporter configuration
let transporter = null;

const initializeEmailTransport = () => {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_NOREPLY_USER,
      pass: process.env.MAIL_NOREPLY_PWD,
    },
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!transporter) {
      initializeEmailTransport();
    }

    const mailOptions = {
      from: process.env.MAIL_NOREPLY_USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  verificationEmail: (name, verificationLink) => `
    <h2>Welcome to OmiHorizn, ${name}!</h2>
    <p>Please verify your email address to activate your account.</p>
    <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>
    <p>This link expires in 24 hours.</p>
  `,

  passwordResetEmail: (name, resetLink) => `
    <h2>Reset Your Password</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to create a new password.</p>
    <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `,

  otpEmail: (name, otp) => `
    <h2>Your OTP Code</h2>
    <p>Hi ${name},</p>
    <p>Your one-time password (OTP) for two-factor authentication is:</p>
    <h1 style="letter-spacing: 5px; font-size: 24px;">${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  `,

  welcomeEmail: (name, firstName) => `
    <h2>Welcome to OmiHorizn!</h2>
    <p>Hi ${firstName},</p>
    <p>Your account has been successfully created. Start exploring your visa and immigration options today.</p>
    <p>Visit our dashboard to begin your journey.</p>
  `,

  subscriptionConfirmationEmail: (name, tier, billingCycle, amount) => `
    <h2>Subscription Confirmation</h2>
    <p>Hi ${name},</p>
    <p>Thank you for subscribing to the <strong>${tier}</strong> plan.</p>
    <p><strong>Billing Details:</strong></p>
    <ul>
      <li>Plan: ${tier}</li>
      <li>Billing Cycle: ${billingCycle}</li>
      <li>Amount: €${amount}</li>
    </ul>
    <p>Your subscription is now active. Enjoy all premium features!</p>
  `,
};

module.exports = {
  validateEmail,
  sendEmail,
  emailTemplates,
  initializeEmailTransport,
};
