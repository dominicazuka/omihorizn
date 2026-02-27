/**
 * Seed Programs Database
 * Populates Program model with comprehensive degree programs
 * 
 * IMPORTANT: Run seedUniversities.js FIRST to populate University collection
 * Run: node seeds/seedPrograms.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Program = require('../models/Program');
const University = require('../models/University');

const seedPrograms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Fetch all universities to get their IDs
    const universities = await University.find().lean();
    if (universities.length === 0) {
      console.error('❌ No universities found. Run seedUniversities.js first!');
      process.exit(1);
    }

    console.log(`📚 Found ${universities.length} universities`);

    // Create programs map: university name -> _id
    const univMap = universities.reduce((acc, u) => {
      acc[u.name] = u._id;
      return acc;
    }, {});

    // Define programs for each university
    const programsByUniversity = {
      'Technical University of Munich (TUM)': [
        {
          name: 'Computer Science (Master)',
          description: 'Advanced computer science with focus on AI and software engineering',
          level: 'master',
          field: 'Computer Science',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-15'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.0,
          workExperienceRequired: 1,
          acceptanceRate: 25,
          avgAcceptedGPA: 3.6,
        },
        {
          name: 'Electrical Engineering (Master)',
          description: 'Cutting-edge electrical engineering and power systems',
          level: 'master',
          field: 'Electrical Engineering',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-15'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.0,
          workExperienceRequired: 0,
          acceptanceRate: 28,
          avgAcceptedGPA: 3.5,
        },
      ],

      'Heidelberg University': [
        {
          name: 'Philosophy (Master)',
          description: 'Philosophical inquiry into ethics, metaphysics, and epistemology',
          level: 'master',
          field: 'Philosophy',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-20'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'SOP', 'Transcript', 'Writing Sample'],
          minimumGPA: 3.2,
          workExperienceRequired: 0,
          acceptanceRate: 35,
          avgAcceptedGPA: 3.5,
        },
        {
          name: 'Medicine (Doctor)',
          description: 'Medical degree with emphasis on research and clinical practice',
          level: 'phd',
          field: 'Medicine',
          duration: 72,
          language: 'German',
          applicationDeadline: new Date('2025-02-15'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TestDaF', 'Interview', 'Transcript', 'CVDeutsch Certificate'],
          minimumGPA: 3.5,
          workExperienceRequired: 0,
          acceptanceRate: 12,
          avgAcceptedGPA: 3.9,
        },
      ],

      'Free University of Berlin (FU)': [
        {
          name: 'International Relations (Master)',
          description: 'Study global politics, diplomacy, and conflict resolution',
          level: 'master',
          field: 'International Relations',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-31'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'SOP', 'LOR', 'Transcript'],
          minimumGPA: 3.0,
          workExperienceRequired: 2,
          acceptanceRate: 30,
          avgAcceptedGPA: 3.4,
        },
      ],

      'University of Lisbon': [
        {
          name: 'Business Administration (Master)',
          description: 'MBA-style program focusing on management and strategy',
          level: 'master',
          field: 'Business',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-02-28'),
          intakeMonths: [9, 10],
          tuitionFee: 7000,
          tuitionCurrency: 'EUR',
          requiredDocs: ['GMAT', 'TOEFL', 'SOP', 'LOR'],
          minimumGPA: 3.0,
          workExperienceRequired: 3,
          acceptanceRate: 45,
          avgAcceptedGPA: 3.3,
        },
        {
          name: 'Civil Engineering (Bachelor)',
          description: 'Comprehensive civil engineering curriculum',
          level: 'bachelor',
          field: 'Civil Engineering',
          duration: 36,
          language: 'English',
          applicationDeadline: new Date('2025-03-31'),
          intakeMonths: [9, 10],
          tuitionFee: 3500,
          tuitionCurrency: 'EUR',
          requiredDocs: ['IELTS', 'Transcript', 'HS Diploma'],
          minimumGPA: 2.8,
          workExperienceRequired: 0,
          acceptanceRate: 60,
          avgAcceptedGPA: 3.2,
        },
      ],

      'University of Helsinki': [
        {
          name: 'Computer Science (Master)',
          description: 'Advanced CS with focus on AI, machine learning, and software development',
          level: 'master',
          field: 'Computer Science',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-15'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.2,
          workExperienceRequired: 0,
          acceptanceRate: 22,
          avgAcceptedGPA: 3.7,
        },
      ],

      'Aalto University': [
        {
          name: 'Technology Entrepreneurship (Master)',
          description: 'Build and scale tech startups with industry mentorship',
          level: 'master',
          field: 'Entrepreneurship',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-31'),
          intakeMonths: [9, 10],
          tuitionFee: 0,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'SOP', 'Business Idea Pitch', 'LOR'],
          minimumGPA: 3.0,
          workExperienceRequired: 1,
          acceptanceRate: 18,
          avgAcceptedGPA: 3.5,
        },
      ],

      'KTH Royal Institute of Technology': [
        {
          name: 'Machine Learning (Master)',
          description: 'Cutting-edge ML, deep learning, and AI applications',
          level: 'master',
          field: 'Computer Science',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-15'),
          intakeMonths: [9, 10],
          tuitionFee: 12000,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.5,
          workExperienceRequired: 0,
          acceptanceRate: 15,
          avgAcceptedGPA: 3.8,
        },
      ],

      'University of Amsterdam (UvA)': [
        {
          name: 'Business Administration (Master)',
          description: 'MBA program with international focus',
          level: 'master',
          field: 'Business',
          duration: 12,
          language: 'English',
          applicationDeadline: new Date('2025-02-15'),
          intakeMonths: [9],
          tuitionFee: 20000,
          tuitionCurrency: 'EUR',
          requiredDocs: ['GMAT', 'TOEFL', 'SOP', 'LOR'],
          minimumGPA: 3.2,
          workExperienceRequired: 5,
          acceptanceRate: 30,
          avgAcceptedGPA: 3.5,
        },
      ],

      'Delft University of Technology (TU Delft)': [
        {
          name: 'Aerospace Engineering (Master)',
          description: 'Advanced aerospace design and research',
          level: 'master',
          field: 'Aerospace Engineering',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-01-31'),
          intakeMonths: [9],
          tuitionFee: 18000,
          tuitionCurrency: 'EUR',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.3,
          workExperienceRequired: 1,
          acceptanceRate: 20,
          avgAcceptedGPA: 3.6,
        },
      ],

      'University of Melbourne': [
        {
          name: 'Master of Science (Computer Science)',
          description: 'Advanced computer science with practical industry experience',
          level: 'master',
          field: 'Computer Science',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-11-30'),
          intakeMonths: [2, 7],
          tuitionFee: 46000,
          tuitionCurrency: 'AUD',
          requiredDocs: ['IELTS', 'GRE', 'Transcript'],
          minimumGPA: 3.0,
          workExperienceRequired: 0,
          acceptanceRate: 35,
          avgAcceptedGPA: 3.4,
        },
      ],

      'University of Sydney': [
        {
          name: 'Bachelor of Engineering (Honours)',
          description: 'Comprehensive engineering education with practical labs',
          level: 'bachelor',
          field: 'Engineering',
          duration: 48,
          language: 'English',
          applicationDeadline: new Date('2025-12-31'),
          intakeMonths: [2, 7],
          tuitionFee: 43000,
          tuitionCurrency: 'AUD',
          requiredDocs: ['IELTS', 'HSC/IB', 'Transcript'],
          minimumGPA: 2.9,
          workExperienceRequired: 0,
          acceptanceRate: 50,
          avgAcceptedGPA: 3.3,
        },
      ],

      'University of Toronto': [
        {
          name: 'Master of Science in Engineering',
          description: 'Research-focused engineering program with thesis',
          level: 'master',
          field: 'Engineering',
          duration: 24,
          language: 'English',
          applicationDeadline: new Date('2025-02-15'),
          intakeMonths: [9, 1],
          tuitionFee: 15000,
          tuitionCurrency: 'CAD',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.2,
          workExperienceRequired: 1,
          acceptanceRate: 28,
          avgAcceptedGPA: 3.5,
        },
      ],

      'University of British Columbia (UBC)': [
        {
          name: 'Master of Data Science',
          description: 'Industry-focused data science with real-world projects',
          level: 'master',
          field: 'Data Science',
          duration: 16,
          language: 'English',
          applicationDeadline: new Date('2025-02-28'),
          intakeMonths: [9],
          tuitionFee: 20000,
          tuitionCurrency: 'CAD',
          requiredDocs: ['TOEFL', 'GRE', 'SOP', 'Transcript'],
          minimumGPA: 3.3,
          workExperienceRequired: 2,
          acceptanceRate: 25,
          avgAcceptedGPA: 3.6,
        },
      ],
    };

    // Clear existing programs
    await Program.deleteMany({});
    console.log('🗑️  Cleared existing programs');

    // Create programs
    let totalPrograms = 0;
    for (const [univName, programs] of Object.entries(programsByUniversity)) {
      const univId = univMap[univName];
      if (!univId) {
        console.warn(`⚠️  University not found: ${univName}`);
        continue;
      }

      const programsWithUnivId = programs.map((p) => ({
        ...p,
        universityId: univId,
      }));

      const created = await Program.insertMany(programsWithUnivId);
      totalPrograms += created.length;
      console.log(`   ✅ Created ${created.length} programs for ${univName}`);
    }

    console.log(`\n✅ Seeded ${totalPrograms} programs total`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding programs:', error.message);
    process.exit(1);
  }
};

seedPrograms();
