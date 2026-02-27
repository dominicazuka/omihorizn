/**
 * Seed Universities Database
 * Populates University model with comprehensive data for supported countries
 * 
 * Run: node seeds/seedUniversities.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const University = require('../models/University');

const universities = [
  // Germany Universities (Top Ranked)
  {
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    city: 'Munich',
    website: 'https://www.tum.de',
    logo: 'https://www.tum.de/favicon.ico',
    qs_ranking: 32,
    times_ranking: 37,
    arwu_ranking: 43,
    description:
      'TU Munich is Europe\'s leading technical university. Strong in engineering, computer science, and mathematics. Excellent placement rate for graduates.',
    founded: 1868,
    studentPopulation: 47000,
    facultyCount: 650,
    email: 'admissions@tum.de',
    phone: '+49 (0)89 289-01',
    admissionsOfficeUrl: 'https://www.tum.de/en/studies/',
  },

  {
    name: 'Heidelberg University',
    country: 'Germany',
    city: 'Heidelberg',
    website: 'https://www.uni-heidelberg.de',
    logo: 'https://www.uni-heidelberg.de/favicon.ico',
    qs_ranking: 47,
    times_ranking: 40,
    arwu_ranking: 62,
    description:
      'Germany\'s oldest university (1386). Renowned for research and liberal arts education. Strong in philosophy, medicine, and natural sciences.',
    founded: 1386,
    studentPopulation: 31000,
    facultyCount: 550,
    email: 'studium@uni-heidelberg.de',
    phone: '+49 (0)6221 54-0',
    admissionsOfficeUrl: 'https://www.uni-heidelberg.de/en/study',
  },

  {
    name: 'Free University of Berlin (FU)',
    country: 'Germany',
    city: 'Berlin',
    website: 'https://www.fu-berlin.de',
    logo: 'https://www.fu-berlin.de/favicon.ico',
    qs_ranking: 122,
    times_ranking: 75,
    arwu_ranking: 151,
    description:
      'Berlin\'s largest university. Strong international atmosphere. Excellent for political science, history, and German studies. Affordable tuition.',
    founded: 1948,
    studentPopulation: 33000,
    facultyCount: 450,
    email: 'info@fu-berlin.de',
    phone: '+49 (0)30 838-0',
    admissionsOfficeUrl: 'https://www.fu-berlin.de/en/studium/index.html',
  },

  // Portugal Universities
  {
    name: 'University of Lisbon',
    country: 'Portugal',
    city: 'Lisbon',
    website: 'https://www.ulisboa.pt',
    logo: 'https://www.ulisboa.pt/favicon.ico',
    qs_ranking: 328,
    times_ranking: 321,
    arwu_ranking: 401,
    description:
      'Portugal\'s oldest university (1290). Located in Europe\'s capital city. Strong in business, engineering, and social sciences. Affordable tuition.',
    founded: 1290,
    studentPopulation: 48000,
    facultyCount: 820,
    email: 'info@ulisboa.pt',
    phone: '+351 21 791 7000',
    admissionsOfficeUrl: 'https://www.ulisboa.pt/en/admission',
  },

  {
    name: 'University of Porto',
    country: 'Portugal',
    city: 'Porto',
    website: 'https://www.up.pt',
    logo: 'https://www.up.pt/favicon.ico',
    qs_ranking: 380,
    times_ranking: 401,
    arwu_ranking: 501,
    description:
      'Portugal\'s second-largest university. Strong engineering and technology programs. Growing international student body. Modern campus facilities.',
    founded: 1911,
    studentPopulation: 38000,
    facultyCount: 680,
    email: 'info@up.pt',
    phone: '+351 22 5590200',
    admissionsOfficeUrl: 'https://www.up.pt/en/admission',
  },

  // Finland Universities
  {
    name: 'University of Helsinki',
    country: 'Finland',
    city: 'Helsinki',
    website: 'https://www.helsinki.fi',
    logo: 'https://www.helsinki.fi/favicon.ico',
    qs_ranking: 93,
    times_ranking: 68,
    arwu_ranking: 90,
    description:
      'Finland\'s leading university. World-class research facilities. Free tuition for EU students. Strong in engineering, medicine, and sciences.',
    founded: 1640,
    studentPopulation: 33000,
    facultyCount: 760,
    email: 'admissions@helsinki.fi',
    phone: '+358 9 1911',
    admissionsOfficeUrl: 'https://www.helsinki.fi/en/admissions',
  },

  {
    name: 'Aalto University',
    country: 'Finland',
    city: 'Espoo',
    website: 'https://www.aalto.fi',
    logo: 'https://www.aalto.fi/favicon.ico',
    qs_ranking: 122,
    times_ranking: 111,
    arwu_ranking: 201,
    description:
      'Finland\'s top tech university. Focus on innovation and entrepreneurship. Free tuition for EU students. Strong startup ecosystem.',
    founded: 2010,
    studentPopulation: 20000,
    facultyCount: 450,
    email: 'admissions@aalto.fi',
    phone: '+358 9 47001',
    admissionsOfficeUrl: 'https://www.aalto.fi/en/admissions',
  },

  // Sweden Universities
  {
    name: 'University of Stockholm',
    country: 'Sweden',
    city: 'Stockholm',
    website: 'https://www.su.se',
    logo: 'https://www.su.se/favicon.ico',
    qs_ranking: 128,
    times_ranking: 89,
    arwu_ranking: 151,
    description:
      'Sweden\'s largest university by enrollment. Located in the capital. Strong in social sciences and humanities. Collaborative research environment.',
    founded: 1878,
    studentPopulation: 38000,
    facultyCount: 700,
    email: 'info@su.se',
    phone: '+46 8 162000',
    admissionsOfficeUrl: 'https://www.su.se/english/admissions',
  },

  {
    name: 'KTH Royal Institute of Technology',
    country: 'Sweden',
    city: 'Stockholm',
    website: 'https://www.kth.se',
    logo: 'https://www.kth.se/favicon.ico',
    qs_ranking: 83,
    times_ranking: 79,
    arwu_ranking: 151,
    description:
      'Sweden\'s leading technical university. Europe\'s top engineering programs. Strong startup culture. Excellent for computer science and engineering.',
    founded: 1827,
    studentPopulation: 15000,
    facultyCount: 350,
    email: 'admissions@kth.se',
    phone: '+46 8 790 6000',
    admissionsOfficeUrl: 'https://www.kth.se/en/studies',
  },

  // Netherlands Universities
  {
    name: 'University of Amsterdam (UvA)',
    country: 'Netherlands',
    city: 'Amsterdam',
    website: 'https://www.uva.nl',
    logo: 'https://www.uva.nl/favicon.ico',
    qs_ranking: 51,
    times_ranking: 56,
    arwu_ranking: 71,
    description:
      'Netherlands\' largest university. Strong in business, law, and social sciences. English-taught programs abundant. Vibrant city location.',
    founded: 1877,
    studentPopulation: 55000,
    facultyCount: 950,
    email: 'admissions@uva.nl',
    phone: '+31 20 525 8080',
    admissionsOfficeUrl: 'https://www.uva.nl/en/education/bachelor-programmes',
  },

  {
    name: 'Delft University of Technology (TU Delft)',
    country: 'Netherlands',
    city: 'Delft',
    website: 'https://www.tudelft.nl',
    logo: 'https://www.tudelft.nl/favicon.ico',
    qs_ranking: 43,
    times_ranking: 52,
    arwu_ranking: 79,
    description:
      'World-leading engineering university. Strong in civil, mechanical, and electrical engineering. Excellent for architecture and design programs.',
    founded: 1842,
    studentPopulation: 28000,
    facultyCount: 620,
    email: 'admissions@tudelft.nl',
    phone: '+31 15 278 9111',
    admissionsOfficeUrl: 'https://www.tudelft.nl/en/education/programmes',
  },

  // Australia Universities
  {
    name: 'University of Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    website: 'https://www.unimelb.edu.au',
    logo: 'https://www.unimelb.edu.au/favicon.ico',
    qs_ranking: 37,
    times_ranking: 31,
    arwu_ranking: 51,
    description:
      'Australia\'s top university. Strong across all disciplines. Excellent international reputation. Good post-study work visa pathway.',
    founded: 1853,
    studentPopulation: 48000,
    facultyCount: 850,
    email: 'admissions@unimelb.edu.au',
    phone: '+61 3 9035 5511',
    admissionsOfficeUrl: 'https://study.unimelb.edu.au/admissions',
  },

  {
    name: 'University of Sydney',
    country: 'Australia',
    city: 'Sydney',
    website: 'https://www.sydney.edu.au',
    logo: 'https://www.sydney.edu.au/favicon.ico',
    qs_ranking: 60,
    times_ranking: 58,
    arwu_ranking: 68,
    description:
      'Australia\'s second-oldest university. Beautiful harbor campus. Strong in engineering, business, and law. Strong international student support.',
    founded: 1850,
    studentPopulation: 50000,
    facultyCount: 900,
    email: 'admissions@sydney.edu.au',
    phone: '+61 2 9351 2222',
    admissionsOfficeUrl: 'https://www.sydney.edu.au/study/',
  },

  // UK Universities
  {
    name: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    website: 'https://www.ox.ac.uk',
    logo: 'https://www.ox.ac.uk/favicon.ico',
    qs_ranking: 4,
    times_ranking: 1,
    arwu_ranking: 7,
    description:
      'World\'s oldest English-speaking university (1096). Collegiate system. World-leading research. Highly selective admission process.',
    founded: 1096,
    studentPopulation: 27000,
    facultyCount: 1200,
    email: 'admissions@ox.ac.uk',
    phone: '+44 1865 270000',
    admissionsOfficeUrl: 'https://www.ox.ac.uk/admissions/',
  },

  {
    name: 'University of Cambridge',
    country: 'United Kingdom',
    city: 'Cambridge',
    website: 'https://www.cam.ac.uk',
    logo: 'https://www.cam.ac.uk/favicon.ico',
    qs_ranking: 2,
    times_ranking: 3,
    arwu_ranking: 6,
    description:
      'Second-oldest English-speaking university (1209). Collegiate system. World-renowned for mathematics and natural sciences. Very selective.',
    founded: 1209,
    studentPopulation: 24000,
    facultyCount: 1100,
    email: 'admissions@cam.ac.uk',
    phone: '+44 1223 337733',
    admissionsOfficeUrl: 'https://www.cam.ac.uk/admissions/',
  },

  // Canada Universities
  {
    name: 'University of Toronto',
    country: 'Canada',
    city: 'Toronto',
    website: 'https://www.utoronto.ca',
    logo: 'https://www.utoronto.ca/favicon.ico',
    qs_ranking: 26,
    times_ranking: 18,
    arwu_ranking: 24,
    description:
      'Canada\'s top university. Strong in engineering and medicine. Located in Canada\'s largest city. Excellent for networking and career opportunities.',
    founded: 1827,
    studentPopulation: 105000,
    facultyCount: 2300,
    email: 'admissions@utoronto.ca',
    phone: '+1 416 978-2011',
    admissionsOfficeUrl: 'https://www.utoronto.ca/admissions/',
  },

  {
    name: 'University of British Columbia (UBC)',
    country: 'Canada',
    city: 'Vancouver',
    website: 'https://www.ubc.ca',
    logo: 'https://www.ubc.ca/favicon.ico',
    qs_ranking: 46,
    times_ranking: 34,
    arwu_ranking: 34,
    description:
      'Canada\'s second-largest university. Located in Vancouver with mountain views. Strong in engineering and natural sciences. Excellent student life.',
    founded: 1915,
    studentPopulation: 68000,
    facultyCount: 1600,
    email: 'admissions@ubc.ca',
    phone: '+1 604-822-2211',
    admissionsOfficeUrl: 'https://you.ubc.ca/applying/',
  },
];

const seedUniversities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await University.deleteMany({});
    console.log('🗑️  Cleared existing universities');

    // Insert seed data
    const result = await University.insertMany(universities);
    console.log(`✅ Seeded ${result.length} universities`);

    // Display summary
    console.log('\n📊 Universities Seeded by Country:');
    const byCountry = universities.reduce((acc, u) => {
      if (!acc[u.country]) acc[u.country] = [];
      acc[u.country].push(u.name);
      return acc;
    }, {});

    Object.entries(byCountry).forEach(([country, unis]) => {
      console.log(`   ${country}: ${unis.length} universities`);
      unis.forEach((name) => console.log(`      - ${name}`));
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding universities:', error.message);
    process.exit(1);
  }
};

seedUniversities();
