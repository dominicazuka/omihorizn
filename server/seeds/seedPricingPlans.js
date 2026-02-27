const mongoose = require('mongoose');
const PricingPlan = require('../models/PricingPlan');

// seeds must connect to MongoDB like other seed files
const dotenv = require('dotenv');
dotenv.config();

// use PremiumFeature so we can populate features dynamically per tier
const PremiumFeature = require('../models/PremiumFeature');

const seedPricingPlans = async () => {
  try {
    // Establish DB connection if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB for pricing seed');
    }

    // Clear existing pricing plans
    await PricingPlan.deleteMany({});

    // helper that queries PremiumFeature model for feature names available to the
    // provided tier. This keeps seed logic in sync with actual features already
    // seeded by the developer earlier.
    const getFeatureNames = async (tier) => {
      if (!['free', 'premium', 'professional'].includes(tier)) return [];
      const accessField = tier === 'free' ? 'freeAccess' : `${tier}Access`;
      const docs = await PremiumFeature.find({ [accessField]: true }).select('name').lean();
      return docs.map(d => d.name);
    };

    const basePlans = [
      {
        tier: 'free',
        name: 'Free',
        description: 'Perfect for exploring and getting started',
        monthlyPrice: 0,
        annualPrice: 0,
        addOns: [],
        highlighted: false,
        cta: 'Get Started'
      },
      {
        tier: 'premium',
        name: 'Premium',
        description: 'Best for serious applicants',
        monthlyPrice: 2499,
        annualPrice: 24999,
        addOns: [
          {
            id: 'extra-advisor',
            name: 'Extra Advisor Session',
            description: 'One additional advisor consultation',
            price: 14900
          },
          {
            id: 'document-review',
            name: 'Premium Document Review',
            description: 'Expert review of your application documents',
            price: 19900
          }
        ],
        highlighted: true,
        cta: 'Start Premium'
      },
      {
        tier: 'professional',
        name: 'Professional',
        description: 'For those seeking personalized excellence',
        monthlyPrice: 29999,
        annualPrice: 299999,
        addOns: [
          {
            id: 'interview-prep',
            name: 'Interview Preparation Pack',
            description: 'Comprehensive interview prep with mock sessions',
            price: 17900
          },
          {
            id: 'priority-support',
            name: 'Priority 24/7 Support',
            description: 'Dedicated support channel for urgent issues',
            price: 9900
          }
        ],
        highlighted: false,
        cta: 'Get Professional'
      }
    ];

    const pricingPlans = [];
    for (const p of basePlans) {
      const features = await getFeatureNames(p.tier);
      pricingPlans.push({ ...p, features });
    }

    const result = await PricingPlan.insertMany(pricingPlans);
    console.log(`✓ Seeded ${result.length} pricing plans`);
    return result;
  } catch (error) {
    console.error('Error seeding pricing plans:', error);
    throw error;
  }
};
// allow this file to be invoked directly as a script
if (require.main === module) {
  seedPricingPlans()
    .then(() => {
      console.log('Pricing seeds complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Pricing seed failed', err);
      process.exit(1);
    });
}

module.exports = seedPricingPlans;
