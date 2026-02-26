import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountrySelectionPage.css';

interface Country {
  id: string;
  name: string;
  region: string;
  flag: string;
  visaTypes: string[];
  universities: number;
  successRate: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  aiScore: number;
}

const countries: Country[] = [
  {
    id: 'canada',
    name: 'Canada',
    region: 'North America',
    flag: '🍁',
    visaTypes: ['Study', 'Work', 'Immigration'],
    universities: 215,
    successRate: 92,
    difficulty: 'Medium',
    aiScore: 95
  },
  {
    id: 'australia',
    name: 'Australia',
    region: 'Oceania',
    flag: '🦘',
    visaTypes: ['Study', 'Work', 'Skilled Migration'],
    universities: 180,
    successRate: 89,
    difficulty: 'Medium',
    aiScore: 92
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    region: 'Europe',
    flag: '🇬🇧',
    visaTypes: ['Study', 'Work', 'Graduate'],
    universities: 170,
    successRate: 88,
    difficulty: 'Medium',
    aiScore: 91
  },
  {
    id: 'germany',
    name: 'Germany',
    region: 'Europe',
    flag: '🇩🇪',
    visaTypes: ['Study', 'Work', 'Blue Card'],
    universities: 300,
    successRate: 91,
    difficulty: 'Easy',
    aiScore: 94
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    region: 'Europe',
    flag: '🇳🇱',
    visaTypes: ['Study', 'Work', 'Highly Skilled'],
    universities: 120,
    successRate: 90,
    difficulty: 'Medium',
    aiScore: 93
  },
  {
    id: 'singapore',
    name: 'Singapore',
    region: 'Asia',
    flag: '🇸🇬',
    visaTypes: ['Work', 'Tech Talent', 'Finance'],
    universities: 4,
    successRate: 87,
    difficulty: 'Hard',
    aiScore: 88
  },
  {
    id: 'usa',
    name: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    visaTypes: ['Study', 'H1B', 'EB', 'Green Card'],
    universities: 5000,
    successRate: 78,
    difficulty: 'Hard',
    aiScore: 82
  },
  {
    id: 'nz',
    name: 'New Zealand',
    region: 'Oceania',
    flag: '🇳🇿',
    visaTypes: ['Study', 'Work', 'Residence'],
    universities: 20,
    successRate: 85,
    difficulty: 'Medium',
    aiScore: 89
  },
  {
    id: 'japan',
    name: 'Japan',
    region: 'Asia',
    flag: '🇯🇵',
    visaTypes: ['Study', 'Work', 'Skilled'],
    universities: 780,
    successRate: 83,
    difficulty: 'Hard',
    aiScore: 85
  },
  {
    id: 'portugal',
    name: 'Portugal',
    region: 'Europe',
    flag: '🇵🇹',
    visaTypes: ['D7', 'Work', 'Tech Visa'],
    universities: 110,
    successRate: 92,
    difficulty: 'Easy',
    aiScore: 94
  },
  {
    id: 'ireland',
    name: 'Ireland',
    region: 'Europe',
    flag: '🇮🇪',
    visaTypes: ['Work', 'Tech', 'Graduate'],
    universities: 34,
    successRate: 89,
    difficulty: 'Medium',
    aiScore: 91
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    region: 'Asia',
    flag: '🇰🇷',
    visaTypes: ['Work', 'Study', 'Tech'],
    universities: 350,
    successRate: 84,
    difficulty: 'Hard',
    aiScore: 86
  }
];

interface RegionTab {
  name: string;
  filter: string;
}

const CountryCard: React.FC<{ country: Country; onSelect: (country: Country) => void }> = ({
  country,
  onSelect
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'Hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="country-card" onClick={() => onSelect(country)}>
      <div className="card-header">
        <span className="flag">{country.flag}</span>
        <span className="ai-score">AI: {country.aiScore}</span>
      </div>
      <h3>{country.name}</h3>
      <p className="region">{country.region}</p>

      <div className="stats-row">
        <div className="stat">
          <span className="stat-value">{country.universities}</span>
          <span className="stat-label">Universities</span>
        </div>
        <div className="stat">
          <span className="stat-value">{country.successRate}%</span>
          <span className="stat-label">Success</span>
        </div>
      </div>

      <div className="visa-types">
        {country.visaTypes.slice(0, 2).map((visa, idx) => (
          <span key={idx} className="visa-badge">
            {visa}
          </span>
        ))}
        {country.visaTypes.length > 2 && <span className="visa-badge">+{country.visaTypes.length - 2}</span>}
      </div>

      <div className="difficulty" style={{ borderLeftColor: getDifficultyColor(country.difficulty) }}>
        <span className="difficulty-dot" style={{ backgroundColor: getDifficultyColor(country.difficulty) }}></span>
        {country.difficulty}
      </div>

      <button className="explore-btn">Explore →</button>
    </div>
  );
};

const CountrySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const regions: RegionTab[] = [
    { name: 'All', filter: 'All' },
    { name: 'Europe', filter: 'Europe' },
    { name: 'Asia', filter: 'Asia' },
    { name: 'North America', filter: 'North America' },
    { name: 'Oceania', filter: 'Oceania' }
  ];

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion;
      const matchesDifficulty = !selectedDifficulty || country.difficulty === selectedDifficulty;
      return matchesSearch && matchesRegion && matchesDifficulty;
    });
  }, [searchQuery, selectedRegion, selectedDifficulty]);

  const handleCountrySelect = (country: Country) => {
    // Navigate to platform with country pre-selected
    navigate(`/auth/signup?country=${country.id}`);
  };

  return (
    <div className="country-selection-page">
      {/* Hero */}
      <section className="country-hero">
        <h1>Explore Your Global Opportunities</h1>
        <p>145+ countries and pathways powered by AI intelligence</p>
      </section>

      {/* Search & Filters */}
      <section className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <div className="region-tabs">
            {regions.map((region) => (
              <button
                key={region.filter}
                className={`region-tab ${selectedRegion === region.filter ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region.filter)}
              >
                {region.name}
              </button>
            ))}
          </div>

          <div className="difficulty-filters">
            <button
              className={`difficulty-btn ${!selectedDifficulty ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty(null)}
            >
              All Difficulty Levels
            </button>
            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
              <button
                key={difficulty}
                className={`difficulty-btn ${selectedDifficulty === difficulty ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="countries-section">
        <div className="results-header">
          <p className="results-count">Showing {filteredCountries.length} countries</p>
        </div>

        <div className="countries-grid">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <CountryCard key={country.id} country={country} onSelect={handleCountrySelect} />
            ))
          ) : (
            <div className="no-results">
              <p>No countries found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="quick-stats">
        <div className="stats-container">
          <div className="stat-box">
            <h3>145+</h3>
            <p>Countries & Territories</p>
          </div>
          <div className="stat-box">
            <h3>50,000+</h3>
            <p>Active Users Worldwide</p>
          </div>
          <div className="stat-box">
            <h3>92%</h3>
            <p>Average Success Rate</p>
          </div>
          <div className="stat-box">
            <h3>3 AI Engines</h3>
            <p>Analyzing Your Fit</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="country-cta">
        <h2>Ready to Take the Next Step?</h2>
        <p>Create your profile and get personalized recommendations based on your profile</p>
        <button className="cta-primary cta-large" onClick={() => navigate('/auth/signup')}>
          Start Your Free Assessment
        </button>
      </section>
    </div>
  );
};

export default CountrySelectionPage;
