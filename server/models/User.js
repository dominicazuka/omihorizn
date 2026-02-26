/**
 * User Model
 * Stores user profile, authentication, and subscription info
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: null,
    },

    // Authentication & Security
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },

    // OAuth
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    googleProfile: {
      type: Object,
      default: null,
    },

    // User Details
    dateOfBirth: {
      type: Date,
      default: null,
    },
    nationality: {
      type: String,
      default: null,
    },
    targetCountries: [String], // Array of country codes
    education: [
      {
        institution: String,
        level: String, // bachelor, master, phd
        field: String,
        graduationYear: Number,
      },
    ],
    workExperience: [
      {
        company: String,
        position: String,
        years: Number,
        startYear: Number,
        endYear: Number,
      },
    ],

    // Subscription & Features
    subscriptionTier: {
      type: String,
      enum: ['free', 'premium', 'professional'],
      default: 'free',
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },

    // User Preferences
    preferences: {
      language: {
        type: String,
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      communication: {
        newsletter: { type: Boolean, default: true },
        updates: { type: Boolean, default: true },
        offers: { type: Boolean, default: true },
        quietHoursStart: { type: String, default: '22:00' }, // 24h format
        quietHoursEnd: { type: String, default: '08:00' },
      },
      privacy: {
        profileVisible: { type: Boolean, default: false },
        shareSuccessStory: { type: Boolean, default: false },
      },
    },

    // User Status
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    recoveryDeadline: {
      type: Date, // 30-day recovery window for deleted accounts
      default: null,
    },

    // Activity Tracking
    lastLogin: {
      type: Date,
      default: null,
    },
    lastActivity: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },

    // Metadata
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Index for performance (email and googleId already have unique index from field definition)
userSchema.index({ subscriptionId: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);
