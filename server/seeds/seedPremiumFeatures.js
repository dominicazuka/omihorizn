/**
 * Seed Premium Features Database
 * Populates PremiumFeature model with tier-based features
 * 
 * Run: node seeds/seedPremiumFeatures.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PremiumFeature = require('../models/PremiumFeature');

const seedPremiumFeatures = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Define premium features
    const features = [
      {
        name: 'AI Document Generator',
        description: 'Generate professional visa documents with AI assistance',
        category: 'ai',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 1, // 1 per month
        premiumLimit: 10, // 10 per month
        professionalLimit: -1, // Unlimited
      },
      {
        name: 'University AI Advisor',
        description: 'Get AI-powered recommendations for universities based on profile',
        category: 'advisor',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 5,
        professionalLimit: -1,
      },
      {
        name: 'Visa Pathway AI',
        description: 'AI analysis of optimal visa pathways to desired country',
        category: 'visa-engines',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 3,
        professionalLimit: -1,
      },
      {
        name: 'Program Matching Engine',
        description: 'AI-powered program recommendations based on GPA, test scores, profile',
        category: 'advisor',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 2, // 2 per month
        premiumLimit: 20,
        professionalLimit: -1,
      },
      {
        name: 'Document Templates Library',
        description: 'Access 100+ professional document templates for applications',
        category: 'documents',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 5, // Access 5 templates
        premiumLimit: 50,
        professionalLimit: -1,
      },
      {
        name: 'Essay Review & Feedback',
        description: 'Professional review of personal statements and essays',
        category: 'documents',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 4, // 4 essays per month
        professionalLimit: -1,
      },
      {
        name: 'Priority Support',
        description: '24/7 priority email and chat support from visa experts',
        category: 'support',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: -1, // Unlimited
        professionalLimit: -1,
      },
      {
        name: 'Personal Application Coach',
        description: 'One-on-one coaching calls with immigration experts',
        category: 'support',
        freeAccess: false,
        premiumAccess: false,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 0,
        professionalLimit: 12, // 12 calls per year (1 per month)
      },
      {
        name: 'Interview Preparation Module',
        description: 'AI mock interviews with feedback for visa/university interviews',
        category: 'advisor',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 6, // 6 mock interviews per month
        professionalLimit: -1,
      },
      {
        name: 'Work Permit Advisor',
        description: 'AI analysis of work permit options and post-graduation job prospects',
        category: 'visa-engines',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 2, // 2 per month
        professionalLimit: -1,
      },
      {
        name: 'Financial Planning Tool',
        description: 'Calculate costs, scholarships, and financing options for study abroad',
        category: 'other',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 1, // Limited calculation
        premiumLimit: -1, // Unlimited
        professionalLimit: -1,
      },
      {
        name: 'Multiple Applications Tracking',
        description: 'Track unlimited visa/university applications in one dashboard',
        category: 'documents',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 3, // Track 3 applications
        premiumLimit: 15, // Track 15 applications
        professionalLimit: -1,
      },
      {
        name: 'Visa Status Tracker',
        description: 'Real-time visa application status tracking with notifications',
        category: 'visa-engines',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 1, // Track 1 application
        premiumLimit: 5,
        professionalLimit: -1,
      },
      {
        name: 'Country Comparison Tool',
        description: 'Compare multiple countries side-by-side on cost, visa, work, living',
        category: 'advisor',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 2, // Can compare 2 countries
        premiumLimit: -1,
        professionalLimit: -1,
      },
      {
        name: 'Deadline Reminder System',
        description: 'Smart reminders for application deadlines, visa expiry, payment dates',
        category: 'other',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 3, // Track 3 deadlines
        premiumLimit: -1,
        professionalLimit: -1,
      },
      {
        name: 'Scholarship Finder AI',
        description: 'AI identifies scholarships matching your profile and programs',
        category: 'ai',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 1, // 1 search per month
        professionalLimit: -1,
      },
      {
        name: 'Document Quality Checker',
        description: 'AI checks documents for errors, compliance, completeness',
        category: 'documents',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 10, // Check 10 documents per month
        professionalLimit: -1,
      },
      {
        name: 'Custom Profile Building',
        description: 'Detailed profile questionnaire to optimize university/visa matching',
        category: 'advisor',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 1, // Build 1 profile
        professionalLimit: -1,
      },
      {
        name: 'Email Support',
        description: 'Standard email support from the OmiHorizn support team',
        category: 'support',
        freeAccess: true,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: -1,
        premiumLimit: -1,
        professionalLimit: -1,
      },
      {
        name: 'Video Call Consultation',
        description: '15-minute video consultation with visa/education advisors',
        category: 'support',
        freeAccess: false,
        premiumAccess: true,
        professionalAccess: true,
        freeLimit: 0,
        premiumLimit: 2, // 2 per month
        professionalLimit: 12, // 12 per year
      },
    ];

    // Clear existing features
    await PremiumFeature.deleteMany({});
    console.log('🗑️  Cleared existing premium features');

    // Insert features
    const created = await PremiumFeature.insertMany(features);
    console.log(`✅ Seeded ${created.length} premium features`);

    // Display summary
    const freeFeatures = features.filter((f) => f.freeAccess).length;
    const premiumFeatures = features.filter((f) => f.premiumAccess).length;
    const professionalFeatures = features.filter((f) => f.professionalAccess).length;

    console.log(`\n📊 Feature Tier Summary:`);
    console.log(`   • Free Tier: ${freeFeatures} features`);
    console.log(`   • Premium Tier: ${premiumFeatures} features`);
    console.log(`   • Professional Tier: ${professionalFeatures} features`);

    // Display categories
    const categories = [...new Set(features.map((f) => f.category))].sort();
    console.log(`\n📂 Feature Categories:`);
    categories.forEach((cat) => {
      const count = features.filter((f) => f.category === cat).length;
      console.log(`   • ${cat}: ${count} features`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding premium features:', error.message);
    process.exit(1);
  }
};

seedPremiumFeatures();
