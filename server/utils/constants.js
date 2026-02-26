/**
 * Constants and Enums
 * Application-wide constants
 */

const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  PROFESSIONAL: 'professional',
};

const SUBSCRIPTION_PRICING = {
  free: {
    monthly: 0,
    annual: 0,
    currency: 'EUR',
  },
  premium: {
    monthly: 2499, // EUR cents
    annual: 24999,
    currency: 'EUR',
  },
  professional: {
    monthly: 29999,
    annual: 299999,
    currency: 'EUR',
  },
};

const DOCUMENT_TYPES = {
  SOP: 'sop',
  CV: 'cv',
  COVER_LETTER: 'cover-letter',
  MOTIVATION_LETTER: 'motivation-letter',
  FINANCIAL_PROOF: 'financial-proof',
  MEDIUM_OF_INSTRUCTION: 'medium-of-instruction',
  TRANSCRIPT: 'transcript',
  CERTIFICATE: 'certificate',
  OTHER: 'other',
};

const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under-review',
  INTERVIEW: 'interview',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const FEATURES_BY_TIER = {
  free: [
    'basic-country-exploration',
    'ai-eligibility-1',
    'limited-profile-access',
    'community-forum',
    'basic-visa-checklist',
  ],
  premium: [
    'all-free-features',
    'unlimited-applications',
    'ai-all-countries',
    'ai-engines-all-3',
    'unlimited-ai-documents',
    'interview-prep',
    'scholarship-discovery',
    'university-recommendations',
    'priority-support-24h',
  ],
  professional: [
    'all-premium-features',
    'advisor-calls',
    'document-review',
    'interview-coaching',
    'unlimited-engine-calls',
    'priority-processing',
    'early-feature-access',
    'vip-support-4h',
  ],
};

const FEATURE_LIMITS = {
  free: {
    'ai-document-generation': 1, // per month
    'ai-eligibility-check': 1,
  },
  premium: {
    'ai-document-generation': null, // unlimited
    'ai-eligibility-check': null,
    'engine-1-calls': 5, // Skill-to-Visa
    'engine-2-calls': 5, // 12-Month Feasibility
    'engine-3-calls': 5, // PR Pathway
  },
  professional: {
    'ai-document-generation': null,
    'ai-eligibility-check': null,
    'engine-1-calls': null, // unlimited
    'engine-2-calls': null,
    'engine-3-calls': null,
  },
};

const VISA_TYPES = ['study', 'work', 'pr', 'dependent', 'visit'];

const DEGREE_LEVELS = ['bachelor', 'master', 'phd', 'diploma', 'certificate'];

const REGIONS = ['Europe', 'Asia', 'North America', 'South America', 'Oceania', 'Africa'];

module.exports = {
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_PRICING,
  DOCUMENT_TYPES,
  APPLICATION_STATUS,
  USER_ROLES,
  PAYMENT_STATUS,
  FEATURES_BY_TIER,
  FEATURE_LIMITS,
  VISA_TYPES,
  DEGREE_LEVELS,
  REGIONS,
};
