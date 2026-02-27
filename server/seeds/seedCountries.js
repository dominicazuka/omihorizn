/**
 * Seed Countries Database
 * Populates Country model with comprehensive visa and immigration data
 * 
 * Run: node seeds/seedCountries.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Country = require('../models/Country');

const countries = [
  // Tier 1 Countries (Primary Focus)
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€11,208/year)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'German Language Proficiency (B1 for some programs)',
    ],
    workVisaRequirements: [
      'Job Offer',
      'Labour Market Test (in some cases)',
      'Proof of Qualifications',
      'Health Insurance',
      'Salary >= €46,560/year (2024)',
    ],
    studySuccessRate: 92,
    workSuccessRate: 88,
    prSuccessRate: 85,
    description:
      'Germany offers strong visa pathways for skilled workers and students. EU Blue Card available for non-EU professionals earning 60% of avg salary. PR pathway: 33 months legal residence for skilled workers.',
    immigrationWebsite: 'https://www.make-it-in-germany.com',
  },

  {
    name: 'Portugal',
    code: 'PT',
    flag: '🇵🇹',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent', 'visit'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€1,000/month)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'Return ticket or proof of funds',
    ],
    workVisaRequirements: [
      'Job Offer from Portuguese employer',
      'Work Permit',
      'Proof of Qualifications',
      'Health Insurance',
      'Salary >= €850/month (2024)',
    ],
    studySuccessRate: 95,
    workSuccessRate: 90,
    prSuccessRate: 88,
    description:
      'Portugal offers one of Europe\'s most accessible immigration pathways. D7 Passive Income visa requires €1,260/month. PR after 5 years legal residence. Most affordable EU tuition.',
    immigrationWebsite: 'https://www.sef.pt',
  },

  {
    name: 'Malta',
    code: 'MT',
    flag: '🇲🇹',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€600/month)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'Police Clearance Certificate',
    ],
    workVisaRequirements: [
      'Job Offer',
      'Work Permit',
      'Employer Registration',
      'Health Insurance',
      'Salary >= €1,000/month',
    ],
    studySuccessRate: 94,
    workSuccessRate: 87,
    prSuccessRate: 86,
    description:
      'Malta has simplified visa procedures for EU citizens. English is official language. Strong remote work visa for digital nomads. PR after 5 years.',
    immigrationWebsite: 'https://www.identitymalta.com',
  },

  // Tier 2 Countries (Secondary)
  {
    name: 'Finland',
    code: 'FI',
    flag: '🇫🇮',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€12,000-€15,000/year)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'Criminal Record Check',
    ],
    workVisaRequirements: [
      'Job Offer',
      'Residence Permit Application',
      'Employer Verification',
      'Health Insurance',
      'Salary >= €2,100/month (avg)',
    ],
    studySuccessRate: 90,
    workSuccessRate: 86,
    prSuccessRate: 83,
    description:
      'Finland ranks #1 in education quality globally. Generous benefits system. PR after 4 years employment. Strong startup visa pathway.',
    immigrationWebsite: 'https://www.migri.fi',
  },

  {
    name: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€12,000-€13,000/year)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'Police Certificate',
    ],
    workVisaRequirements: [
      'Job Offer from Swedish employer',
      'Residence Permit',
      'Swedish Coordination Number',
      'Health Insurance',
      'Salary >= €2,200/month',
    ],
    studySuccessRate: 91,
    workSuccessRate: 88,
    prSuccessRate: 84,
    description:
      'Sweden offers world-class education and work environment. Strong gender equality. PR pathway: 4 years employment. Popular for tech professionals.',
    immigrationWebsite: 'https://www.migrationsverket.se',
  },

  {
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€12,000/year)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'CRW/IND approval',
    ],
    workVisaRequirements: [
      'Job Offer from Dutch employer',
      'Work Permit (AMvB)',
      'Employer Sponsorship',
      'Health Insurance',
      'Salary >= €3,500/month (knowledge migrants)',
    ],
    studySuccessRate: 93,
    workSuccessRate: 89,
    prSuccessRate: 86,
    description:
      'Netherlands is Europe\'s startup hub. 30% tax incentive for foreign workers. English widely spoken. PR after 5 years uninterrupted residence.',
    immigrationWebsite: 'https://www.ind.nl',
  },

  {
    name: 'Belgium',
    code: 'BE',
    flag: '🇧🇪',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€9,000-€12,000/year)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'Proof of Accommodation',
    ],
    workVisaRequirements: [
      'Job Offer',
      'Work Permit Category A',
      'Employer Registration',
      'Health Insurance',
      'Salary >= €2,500/month',
    ],
    studySuccessRate: 89,
    workSuccessRate: 85,
    prSuccessRate: 82,
    description:
      'Belgium is home to EU institutions and major tech companies. Multiple work visa categories. PR after 5 years residence. Hub for international professionals.',
    immigrationWebsite: 'https://www.belgium.be/en/life_in_belgium',
  },

  // Tier 3 Countries (Growth)
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    region: 'Oceania',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (AUD $24,000/year)',
      'Health Insurance (OSHC)',
      'Passport (valid 6+ months)',
      'English Language Test (IELTS 6.0+)',
    ],
    workVisaRequirements: [
      'Skilled Occupation List (SOL) match',
      'Skilled Independent visa or Employer Sponsorship',
      'Points Test Passed (65+)',
      'Health Insurance',
      'State Sponsorship (for some)',
    ],
    studySuccessRate: 88,
    workSuccessRate: 84,
    prSuccessRate: 80,
    description:
      'Australia has robust skilled migration program. PR pathway: study → work → residency. Points-based system favors young professionals with relevant skills.',
    immigrationWebsite: 'https://immi.homeaffairs.gov.au',
  },

  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission from licensed institution',
      'Proof of Financial Means (£30,000/year)',
      'Tuberculosis Test (from endemic countries)',
      'Passport (valid 6+ months)',
      'IELTS 5.5+ or equivalent',
    ],
    workVisaRequirements: [
      'Certificate of Sponsorship from employer',
      'Salary >= £30,000/year',
      'Skilled Occupation Match',
      'Health Insurance',
      'Points-based visa requirement met',
    ],
    studySuccessRate: 92,
    workSuccessRate: 87,
    prSuccessRate: 81,
    description:
      'UK offers flexible points-based work visa. Graduate route allows 2-3 years post-study work. Strong in tech and finance sectors. PR after 5 years.',
    immigrationWebsite: 'https://www.gov.uk/uk-visas-immigration',
  },

  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    region: 'North America',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission from DLI',
      'Proof of Financial Means (CAD $40,000-50,000)',
      'Medical Exam',
      'Passport (valid during study)',
      'Police Certificate',
    ],
    workVisaRequirements: [
      'Job Offer (most categories)',
      'Labour Impact Assessment (LIA)',
      'Proof of Qualifications',
      'Medical Exam',
      'Police Certificate',
    ],
    studySuccessRate: 94,
    workSuccessRate: 90,
    prSuccessRate: 88,
    description:
      'Canada has most welcoming immigration system. Study → work → PR pathway smooth. Emphasis on education and skilled workers. Express Entry system efficient.',
    immigrationWebsite: 'https://www.canada.ca/immigration',
  },

  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    region: 'Oceania',
    visaTypes: ['study', 'work', 'pr', 'dependent'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (NZD $20,000/year)',
      'Medical Examination',
      'Passport (valid 6+ months)',
      'Health & Character requirements',
    ],
    workVisaRequirements: [
      'Job Offer (preferred)',
      'Skill on Long Term Skill Shortage List (LTSSL)',
      'Points requirement (100+)',
      'Medical Examination',
      'Character requirements',
    ],
    studySuccessRate: 91,
    workSuccessRate: 86,
    prSuccessRate: 84,
    description:
      'New Zealand offers quality of life advantages. Essential Skills pathway for lower-skilled workers. Fast-track PR for specific occupations. Growing tech sector.',
    immigrationWebsite: 'https://www.immigration.govt.nz',
  },

  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    region: 'Europe',
    visaTypes: ['study', 'work', 'pr', 'dependent', 'visit'],
    studyVisaRequirements: [
      'Letter of Admission',
      'Proof of Financial Means (€1,350/month)',
      'Health Insurance',
      'Passport (valid 6+ months)',
      'Accommodation proof',
    ],
    workVisaRequirements: [
      'Job Offer',
      'Work Permit',
      'Employer Verification',
      'Health Insurance',
      'Salary >= €1,350/month',
    ],
    studySuccessRate: 90,
    workSuccessRate: 85,
    prSuccessRate: 83,
    description:
      'Spain offers affordable living and Mediterranean lifestyle. Growing startup scene. Non-lucrative visa for passive income. PR after 5 years legal residence.',
    immigrationWebsite: 'https://www.inclusion.gob.es',
  },

  {
    name: 'Germany (Berlin)',
    code: 'DE-BE',
    flag: '🇩🇪',
    region: 'Europe',
    visaTypes: ['work', 'pr'],
    studyVisaRequirements: [],
    workVisaRequirements: ['Freelance/Startup visa available', 'Business Plan', 'No minimum income requirement (unlike other EU countries)'],
    studySuccessRate: 0,
    workSuccessRate: 92,
    prSuccessRate: 87,
    description:
      'Berlin tech hub offers freelance visa for remote workers and entrepreneurs. Highly accessible visa pathway. Growing startup ecosystem. Hub for tech talent.',
    immigrationWebsite: 'https://www.berlin.de/en/',
  },
];

const seedCountries = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Country.deleteMany({});
    console.log('🗑️  Cleared existing countries');

    // Insert seed data
    const result = await Country.insertMany(countries);
    console.log(`✅ Seeded ${result.length} countries`);

    // Display summary
    console.log('\n📊 Countries Seeded:');
    result.forEach((country) => {
      console.log(`   ${country.flag} ${country.name} (${country.code}) - ${country.region}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding countries:', error.message);
    process.exit(1);
  }
};

seedCountries();
