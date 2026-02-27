import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => (
  <section className="hero-section">
    <div className="hero-content">
      <h1 className="hero-title">
        Global Mobility Intelligence, Without Expensive Agents
      </h1>
      <p className="hero-subtitle">
        Make informed migration decisions with probabilistic visa engines, verified pathways, and AI-powered guidance. 
        Study abroad, relocate for work, or plan permanent residency—independently.
      </p>
      <div className="hero-ctas">
        <button className="cta-primary" onClick={onCtaClick}>
          Start Your Journey
        </button>
        <button className="cta-secondary" onClick={() => {
          const element = document.querySelector('.features-section') as HTMLElement;
          if (element) {
            window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
          }
        }}>
          Learn How It Works
        </button>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-number">50,000+</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat">
          <span className="stat-number">145</span>
          <span className="stat-label">Countries & Pathways</span>
        </div>
        <div className="stat">
          <span className="stat-number">92%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </div>
    </div>
    <div className="hero-image">
      <div className="hero-placeholder">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#E8F0FF"/>
          <circle cx="100" cy="100" r="50" fill="#4A90E2"/>
          <rect x="150" y="80" width="180" height="120" fill="#F39C12" rx="8"/>
          <circle cx="300" cy="250" r="30" fill="#27AE60"/>
        </svg>
      </div>
    </div>
  </section>
);

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="feature-item">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => (
  <section className="features-section">
    <h2 className="section-title">Why Choose OmiHorizn?</h2>
    <div className="features-grid">
      <FeatureItem
        icon="🤖"
        title="Three Intelligence Engines"
        description="Get realistic probability scores for your visa eligibility, 12-month feasibility assessment, and optimal PR pathways—no false promises."
      />
      <FeatureItem
        icon="🧠"
        title="AI-Powered Documents"
        description="Generate professional SOPs, motivation letters, and cover letters tailored to your target universities using advanced AI."
      />
      <FeatureItem
        icon="📊"
        title="Verified Data"
        description="Access an authoritative database of 10,000+ universities, visa requirements, and scholarship opportunities—curated by experts."
      />
      <FeatureItem
        icon="💼"
        title="Professional Services"
        description="Get advisor calls, document reviews, and interview coaching from experienced migration professionals (Premium+ tiers)."
      />
      <FeatureItem
        icon="🌍"
        title="Multi-Country Support"
        description="Explore 145+ countries and pathways. From Germany to Australia, Canada to Singapore—find your ideal destination."
      />
      <FeatureItem
        icon="🔒"
        title="Privacy & Security"
        description="Your data stays yours. End-to-end encryption, no data selling, and full compliance with GDPR and international privacy laws."
      />
    </div>
  </section>
);

interface SuccessStoryProps {
  name: string;
  country: string;
  testimonial: string;
  result: string;
}

const SuccessStory: React.FC<SuccessStoryProps> = ({ name, country, testimonial, result }) => (
  <div className="success-story">
    <p className="story-testimonial">"{testimonial}"</p>
    <div className="story-footer">
      <div className="story-info">
        <h4 className="story-name">{name}</h4>
        <p className="story-country">{country}</p>
      </div>
      <div className="story-result">{result}</div>
    </div>
  </div>
);

const SuccessStoriesSection: React.FC = () => (
  <section className="success-section">
    <h2 className="section-title">Success Stories from Our Community</h2>
    <div className="stories-grid">
      <SuccessStory
        name="Amara O."
        country="Nigeria → Germany"
        testimonial="OmiHorizn showed me my actual probability of getting the German Opportunity Card. I focused on the right certifications and got approved in 8 months."
        result="Relocated 2024"
      />
      <SuccessStory
        name="Priya M."
        country="India → Australia"
        testimonial="The AI-generated SOP was impressive, but what really helped was understanding my realistic PR timeline. I chose the right pathway."
        result="PR Approved 2024"
      />
      <SuccessStory
        name="Chen W."
        country="Taiwan → Canada"
        testimonial="Three intelligence engines showed me exactly what I needed to improve. Their interview prep was game-changing."
        result="Visa Approved 2024"
      />
      <SuccessStory
        name="Sofia K."
        country="Brazil → Portugal"
        testimonial="As a student, the scholarship matching saved me €50k. Plus the document review service was invaluable."
        result="Scholarship: €40k/yr"
      />
    </div>
  </section>
);

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ name, price, description, features, cta, highlighted }) => (
  <div className={`pricing-tier ${highlighted ? 'highlighted' : ''}`}>
    <h3 className="tier-name">{name}</h3>
    <p className="tier-price">{price}</p>
    <p className="tier-description">{description}</p>
    <ul className="tier-features">
      {features.map((feature, idx) => (
        <li key={idx}>
          <span className="feature-check">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`tier-cta ${highlighted ? 'cta-primary' : 'cta-secondary'}`}>
      {cta}
    </button>
  </div>
);

const PricingPreviewSection: React.FC<{ onViewPricing: () => void }> = ({ onViewPricing }) => (
  <section className="pricing-preview-section">
    <h2 className="section-title">Transparent, Flexible Pricing</h2>
    <div className="pricing-grid">
      <PricingTier
        name="Free"
        price="€0"
        description="Get started for free"
        features={[
          "3 applications",
          "Basic templates",
          "Community forums",
          "Email support (48h response)"
        ]}
        cta="Start Free"
      />
      <PricingTier
        name="Premium"
        price="€24.99/mo"
        description="Most popular"
        features={[
          "Unlimited applications",
          "All 3 Intelligence Engines",
          "Unlimited AI documents",
          "Interview prep module",
          "Priority support (24h)"
        ]}
        cta="Start Premium"
        highlighted={true}
      />
      <PricingTier
        name="Professional"
        price="€299.99/mo"
        description="Complete support"
        features={[
          "Everything in Premium",
          "1 advisor call/month",
          "Document review service",
          "Interview coaching",
          "VIP support (4h response)"
        ]}
        cta="Start Professional"
      />
    </div>
    <button className="view-pricing-btn" onClick={onViewPricing}>
      View Complete Pricing Details →
    </button>
  </section>
);

const CTASection: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => (
  <section className="cta-section">
    <h2>Ready to Take Control of Your Migration Journey?</h2>
    <p>Join 50,000+ professionals and students who've already started.</p>
    <button className="cta-primary cta-large" onClick={onCtaClick}>
      Get Started Free Today
    </button>
  </section>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCtaClick = () => {
    navigate('/auth/signup');
  };

  const handleViewPricing = () => {
    navigate('/pricing');
  };

  return (
    <div className="landing-page">
      <HeroSection onCtaClick={handleCtaClick} />
      <FeaturesSection />
      <SuccessStoriesSection />
      <PricingPreviewSection onViewPricing={handleViewPricing} />
      <CTASection onCtaClick={handleCtaClick} />
    </div>
  );
};

export default LandingPage;
