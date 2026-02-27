/**
 * Email Utilities
 * Handles email validation and template rendering with blue-themed HTML templates
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

// Email header template (reusable)
const emailHeader = () => `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        padding: 40px 20px;
        text-align: center;
        color: white;
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
        letter-spacing: 1px;
      }
      .tagline {
        font-size: 14px;
        opacity: 0.95;
        margin-top: 5px;
      }
      .content {
        padding: 40px 30px;
      }
      .greeting {
        font-size: 22px;
        color: #0066cc;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .text {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
        line-height: 1.8;
      }
      .btn-container {
        text-align: center;
        margin: 30px 0;
      }
      .btn {
        display: inline-block;
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white;
        padding: 14px 40px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
      }
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
      }
      .highlight {
        background: linear-gradient(120deg, #e0f0ff, #ffffff);
        border-left: 4px solid #0066cc;
        padding: 15px 20px;
        border-radius: 4px;
        margin: 20px 0;
      }
      .code-box {
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        padding: 20px;
        border-radius: 6px;
        text-align: center;
        margin: 20px 0;
      }
      .code {
        font-family: 'Courier New', monospace;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #0066cc;
      }
      .footer {
        background: #f9f9f9;
        padding: 20px 30px;
        border-top: 1px solid #e0e0e0;
        text-align: center;
        font-size: 13px;
        color: #999;
      }
      .footer-text {
        margin: 8px 0;
      }
      .social-links {
        margin-top: 15px;
      }
      .social-links a {
        color: #0066cc;
        text-decoration: none;
        margin: 0 10px;
        font-weight: 500;
      }
      .warning {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px 20px;
        border-radius: 4px;
        margin: 20px 0;
        color: #856404;
      }
      .success {
        background: #d4edda;
        border-left: 4px solid #28a745;
        padding: 15px 20px;
        border-radius: 4px;
        margin: 20px 0;
        color: #155724;
      }
      .features-list {
        list-style: none;
        padding: 0;
      }
      .features-list li {
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
        color: #555;
      }
      .features-list li:before {
        content: "✓ ";
        color: #0066cc;
        font-weight: bold;
        margin-right: 10px;
      }
      .features-list li:last-child {
        border-bottom: none;
      }
    </style>
  </head>
`;

// Email templates
const emailTemplates = {
  verificationEmail: (name, verificationLink) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Welcome to OmiHorizn, ${name}!</div>
          <div class="text">
            Thank you for creating an account with us. We're excited to help you navigate your visa and immigration journey with ease and confidence.
          </div>
          
          <div class="highlight">
            <strong>Verify Your Email Address</strong><br>
            To activate your account and access all features, please verify your email address by clicking the button below.
          </div>

          <div class="btn-container">
            <a href="${verificationLink}" class="btn">Verify Email Address</a>
          </div>

          <div class="text" style="font-size: 14px; color: #999;">
            <strong>Verification Link Expires In:</strong> 24 hours
          </div>

          <div class="text">
            <strong>What you can do after verification:</strong>
          </div>
          <ul class="features-list">
            <li>Create and manage your visa applications</li>
            <li>Upload and organize important documents</li>
            <li>Track application progress</li>
            <li>Connect with immigration advisors</li>
            <li>Access premium features and insights</li>
          </ul>

          <div class="text">
            If you didn't create this account, you can safely ignore this email.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordResetEmail: (name, resetLink) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Password Reset Request</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            We received a request to reset your OmiHorizn account password. If you didn't make this request, you can safely ignore this email.
          </div>

          <div class="highlight">
            <strong>Reset Your Password</strong><br>
            Click the button below to create a new password for your account.
          </div>

          <div class="btn-container">
            <a href="${resetLink}" class="btn">Reset Password</a>
          </div>

          <div class="text" style="font-size: 14px; color: #999;">
            <strong>Reset Link Expires In:</strong> 1 hour
          </div>

          <div class="warning">
            <strong>Security Note:</strong> This password reset link is unique and can only be used once. If you have trouble resetting your password, contact our support team.
          </div>

          <div class="text">
            <strong>Didn't request a password reset?</strong><br>
            Your account security is important to us. If you didn't request this reset, please change your password immediately or contact our support team.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  otpEmail: (name, otp, purpose = 'authentication') => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Two-Factor Authentication</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Your one-time password (OTP) for ${purpose} verification is displayed below. This code is valid for 10 minutes only.
          </div>

          <div class="code-box">
            <div class="code">${otp}</div>
          </div>

          <div class="text" style="font-size: 14px; color: #999;">
            <strong>Expires In:</strong> 10 minutes
          </div>

          <div class="warning">
            <strong>Important:</strong> Never share this code with anyone. OmiHorizn support will never ask for your OTP code.
          </div>

          <div class="text">
            If you didn't request this code, your account may be at risk. Please change your password immediately and contact our support team.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  welcomeEmail: (firstName) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Welcome to OmiHorizn, ${firstName}!</div>
          
          <div class="success">
            Your email has been verified successfully. Your account is now fully activated!
          </div>

          <div class="text">
            You're all set to start your visa and immigration journey with us. Here's what you can do next:
          </div>

          <ul class="features-list">
            <li>Complete your profile to unlock personalized recommendations</li>
            <li>Create your first visa application</li>
            <li>Upload important documents securely</li>
            <li>Schedule a consultation with an advisor</li>
            <li>Explore visa requirements for your destination country</li>
          </ul>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Go to Dashboard</a>
          </div>

          <div class="highlight">
            <strong>Need Help?</strong><br>
            Our dedicated support team is here to assist you. Reach out to us at any time with questions about your application.
          </div>

          <div class="text">
            Thank you for choosing OmiHorizn. We look forward to helping you achieve your immigration goals!
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  subscriptionConfirmationEmail: (name, tier, billingCycle, amount) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Subscription Confirmed!</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Thank you for upgrading to our ${tier} plan! Your subscription is now active and you can access all premium features immediately.
          </div>

          <div class="success">
            <strong>Subscription Details</strong>
          </div>

          <div class="highlight">
            <strong>Plan:</strong> ${tier}<br>
            <strong>Billing Cycle:</strong> ${billingCycle}<br>
            <strong>Amount:</strong> €${amount}<br>
            <strong>Status:</strong> Active
          </div>

          <div class="text">
            <strong>Your Premium Benefits Include:</strong>
          </div>
          <ul class="features-list">
            <li>Unlimited visa applications</li>
            <li>Priority support access</li>
            <li>Advanced document templates</li>
            <li>Advisor consultations</li>
            <li>Real-time visa updates</li>
            <li>Interview preparation tools</li>
          </ul>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/dashboard/premium" class="btn">Explore Premium Features</a>
          </div>

          <div class="text" style="font-size: 14px; color: #999;">
            <strong>Renewal Date:</strong> Your subscription will automatically renew on the due date. You'll receive a notification before renewal.
          </div>

          <div class="text">
            If you have any questions or need assistance, our support team is ready to help!
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordChangedEmail: (name) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Password Changed Successfully</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            This email confirms that your OmiHorizn account password was changed successfully on ${new Date().toLocaleString()}.
          </div>

          <div class="success">
            If you made this change, no action is needed. Your account is secure.
          </div>

          <div class="warning">
            <strong>Didn't Change Your Password?</strong><br>
            If you didn't change your password, please secure your account immediately by clicking the button below to reset it.
          </div>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/auth/forgot-password" class="btn">Reset Password Now</a>
          </div>

          <div class="text">
            For security, all your active sessions have been logged out. You'll need to log in again with your new password.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  accountDeletionNoticeEmail: (name) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Account Deletion Initiated</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Your account deletion request has been received. Your account and all associated data will be permanently deleted in 30 days.
          </div>

          <div class="highlight">
            <strong>Recovery Window: 30 Days</strong><br>
            You can recover your account by logging in within the next 30 days.
          </div>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/auth/login" class="btn">Log In to Recover Account</a>
          </div>

          <div class="warning">
            <strong>Important:</strong> After 30 days, your account and all data will be permanently deleted. This action cannot be undone.
          </div>

          <div class="text">
            If you changed your mind or have questions about the deletion process, please contact our support team immediately.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  paymentSuccessEmail: (name, paymentId, amount, tier, renewalDate) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Payment Successful!</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Your payment has been processed successfully. Your ${tier} subscription is now active and you have instant access to all premium features.
          </div>

          <div class="success">
            <strong>Payment Receipt</strong>
          </div>

          <div class="highlight">
            <strong>Transaction ID:</strong> ${paymentId}<br>
            <strong>Amount Paid:</strong> €${(amount / 100).toFixed(2)}<br>
            <strong>Subscription Tier:</strong> ${tier}<br>
            <strong>Next Billing Date:</strong> ${new Date(renewalDate).toLocaleDateString()}<br>
            <strong>Status:</strong> Completed
          </div>

          <div class="text">
            <strong>What's Next?</strong>
          </div>
          <ul class="features-list">
            <li>Access unlimited visa applications</li>
            <li>Use premium document templates</li>
            <li>Schedule advisor consultations</li>
            <li>Get priority support (24 hours)</li>
            <li>Unlock all intelligence engines</li>
          </ul>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Start Using Premium Features</a>
          </div>

          <div class="text" style="font-size: 14px; color: #999;">
            <strong>Automatic Renewal:</strong> Your subscription will automatically renew on ${new Date(renewalDate).toLocaleDateString()}. No action needed.
          </div>

          <div class="text">
            If you need an invoice or have questions, please visit your account settings or contact our support team.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  subscriptionUpgradeEmail: (name, oldTier, newTier, proration) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Subscription Upgraded!</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Your subscription has been upgraded successfully. You now have access to all ${newTier} tier features and benefits.
          </div>

          <div class="success">
            <strong>Upgrade Details</strong>
          </div>

          <div class="highlight">
            <strong>From:</strong> ${oldTier}<br>
            <strong>To:</strong> ${newTier}<br>
            ${proration > 0 ? `<strong>Proration Credit:</strong> €${(proration / 100).toFixed(2)}<br>` : ''}
            <strong>Status:</strong> Effective Immediately
          </div>

          <div class="text">
            <strong>New Features Now Available:</strong>
          </div>
          <ul class="features-list">
            <li>Enhanced document templates and AI tools</li>
            <li>Priority support with faster response times</li>
            <li>Advanced visa pathway analysis</li>
            <li>Exclusive advisor services</li>
            <li>Detailed interview preparation tools</li>
          </ul>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/dashboard/premium" class="btn">Explore New Features</a>
          </div>

          <div class="text">
            Your usage limits have been reset for the new billing cycle. Thank you for choosing OmiHorizn!
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  subscriptionCancelledEmail: (name, reason = '') => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Subscription Cancelled</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Your subscription has been cancelled as requested. You will retain access to your free tier features, and all your data has been preserved.
          </div>

          <div class="warning">
            <strong>What Happens Now?</strong><br>
            You'll lose access to premium features, but can still use OmiHorizn with our free tier (limited features, slower support).
          </div>

          <div class="highlight">
            <strong>We'd Love Your Feedback</strong><br>
            ${reason ? `You mentioned: ${reason}` : 'Help us improve by letting us know why you cancelled.'}<br>
            <br>
            Your feedback helps us serve you better in the future.
          </div>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/plans" class="btn">See Our Plans Again</a>
          </div>

          <div class="text">
            You can reactivate your subscription at any time from your account settings. Special offers may be available if you upgrade again soon!
          </div>

          <div class="text">
            If you have questions or need help, please don't hesitate to contact our support team.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  renewalReminderEmail: (name, tier, renewalDate, daysAhead) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Upcoming Subscription Renewal</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            This is a friendly reminder that your <strong>${tier}</strong> subscription will renew in ${daysAhead} day(s) on <strong>${new Date(renewalDate).toLocaleDateString()}</strong>.
          </div>
          <div class="text">
            No action is required if you wish to continue your subscription – your card on file will be charged automatically. If you would like to make changes or cancel, please visit your account settings.
          </div>
          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/account/subscription" class="btn">Manage Subscription</a>
          </div>
          <div class="text">
            Thank you for being a valued OmiHorizn customer!
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  supportTicketConfirmationEmail: (name, ticketId, category, slaHours) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Support Ticket Received</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            Thank you for reaching out! Your support ticket has been successfully created and is now in our queue.
          </div>

          <div class="success">
            <strong>Ticket Details</strong>
          </div>

          <div class="highlight">
            <strong>Ticket ID:</strong> ${ticketId}<br>
            <strong>Category:</strong> ${category}<br>
            <strong>Expected Response Time:</strong> Within ${slaHours} hours<br>
            <strong>Status:</strong> Open
          </div>

          <div class="text">
            Our support team is reviewing your ticket and will respond as soon as possible. You can track your ticket status in your account dashboard.
          </div>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/support/tickets/${ticketId}" class="btn">View Ticket Status</a>
          </div>

          <div class="text">
            <strong>Keep this ticket ID handy:</strong> ${ticketId}<br>
            You'll need it if you want to reference your support request.
          </div>

          <div class="text">
            In the meantime, you can check our knowledge base or FAQ section for quick answers to common questions.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  supportTicketReplyEmail: (name, ticketId, agentName, message) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Support Team Response</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            ${agentName} from our support team has responded to your ticket.
          </div>

          <div class="highlight">
            <strong>${agentName}'s Response:</strong><br>
            ${message}
          </div>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/support/tickets/${ticketId}" class="btn">Reply to Ticket</a>
          </div>

          <div class="text">
            Please review the response and let us know if you need any additional assistance.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  refundInitiatedEmail: (name, paymentId, amount, currency) => `
    <!DOCTYPE html>
    <html>
    ${emailHeader()}
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">OmiHorizn</div>
          <div class="tagline">Your Visa & Immigration Partner</div>
        </div>
        <div class="content">
          <div class="greeting">Refund Initiated</div>
          <div class="text">
            Hi ${name},
          </div>
          <div class="text">
            We have initiated a refund for your recent payment. Please see the details below.
          </div>

          <div class="success">
            <strong>Refund Details</strong>
          </div>

          <div class="highlight">
            <strong>Original Payment ID:</strong> ${paymentId}<br>
            <strong>Refund Amount:</strong> ${currency} ${amount}<br>
            <strong>Status:</strong> Pending (5-7 business days)<br>
            <strong>Refund Method:</strong> Back to original payment method
          </div>

          <div class="text">
            <strong>What to expect:</strong>
          </div>
          <ul class="features-list">
            <li>Refund will appear in your account within 5-7 business days</li>
            <li>Your subscription has been cancelled and all premium features are now disabled</li>
            <li>You can upgrade again anytime by selecting a subscription tier</li>
            <li>Need help? Contact our support team</li>
          </ul>

          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Back to Dashboard</a>
          </div>

          <div class="text">
            If you have any questions or did not request this refund, please contact our support team immediately.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© 2026 OmiHorizn. All rights reserved.</div>
          <div class="footer-text">Omimek Technology Limited</div>
          <div class="social-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
};

module.exports = {
  validateEmail,
  sendEmail,
  emailTemplates,
  initializeEmailTransport,
};