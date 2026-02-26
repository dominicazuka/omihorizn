import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlatformOverviewPage.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

const FeaturesComparison: React.FC = () => {
  const features: Feature[] = [
    {
      id: 'visa-intelligence-1',
      title: 'Visa Intelligence Engine 1',
      description: 'Real-time visa eligibility assessment based on your profile',
      benefits: ['Instant eligibility checking', 'Multiple country paths', 'Success rate predictions', 'Ongoing updates'],
      icon: '🎯'
    },
    {
      id: 'visa-intelligence-2',
      title: 'Visa Intelligence Engine 2',
      description: 'Smart matching between your profile and visa requirements',
      benefits: ['Personalized recommendations', 'Timeline predictions', 'Document checklists', 'Cost estimates'],
      icon: '🔍'
    },
    {
      id: 'visa-intelligence-3',
      title: 'Visa Intelligence Engine 3',
      description: 'Predictive analytics for visa approval likelihood',
      benefits: ['ML-powered predictions', 'Risk assessment', 'Alternative pathways', 'Expert insights'],
      icon: '📊'
    }
  ];

  return (
    <div className="features-comparison">
      <div className="comparison-header">
        <h2>Meet Our Intelligence Engines</h2>
        <p>Three AI-powered systems working together to guide your migration journey</p>
      </div>
      <div className="features-matrix">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon-large">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
            <ul className="benefits-list">
              {feature.benefits.map((benefit, idx) => (
                <li key={idx}>
                  <span className="check-mark">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps: ProcessStep[] = [
    {
      step: 1,
      title: 'Create Your Profile',
      description: 'Tell us about your background, qualifications, and migration goals'
    },
    {
      step: 2,
      title: 'Get Analyzed',
      description: 'Our three intelligence engines assess your eligibility instantly'
    },
    {
      step: 3,
      title: 'Explore Pathways',
      description: 'View all possible countries and visa options ranked by fit'
    },
    {
      step: 4,
      title: 'Get Guidance',
      description: 'Access AI-powered recommendations and professional advice'
    },
    {
      step: 5,
      title: 'Track Progress',
      description: 'Monitor your application timeline and document requirements'
    },
    {
      step: 6,
      title: 'Succeed',
      description: 'Reach your destination with confidence'
    }
  ];

  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        {steps.map((step, idx) => (
          <div key={step.step} className="step">
            <div className="step-number">{step.step}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {idx < steps.length - 1 && <div className="step-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const PlatformBenefits: React.FC = () => {
  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get results in minutes, not months'
    },
    {
      icon: '🔒',
      title: 'Data Privacy',
      description: 'Enterprise-grade encryption and security'
    },
    {
      icon: '🌍',
      title: '145+ Countries',
      description: 'Explore pathways worldwide'
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Advanced machine learning algorithms'
    },
    {
      icon: '👨‍💼',
      title: 'Expert Support',
      description: 'Professional immigration advisors'
    },
    {
      icon: '✅',
      title: '92% Success',
      description: 'Verified success rates'
    }
  ];

  return (
    <div className="benefits-section">
      <h2>Why Choose OmiHorizn?</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TestimonialData {
  name: string;
  country: string;
  destination: string;
  quote: string;
  image: string;
}

const DetailedTestimonials: React.FC = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  const testimonials: TestimonialData[] = [
    {
      name: 'Amara Okafor',
      country: 'Nigeria',
      destination: 'Germany',
      quote:
        "I was overwhelmed with visa options and requirements. OmiHorizn's intelligence engines showed me the perfect path to Germany. The AI recommendations were spot-on, and I got my visa approved on the first attempt!",
      image: '👩‍🎓'
    },
    {
      name: 'Priya Sharma',
      country: 'India',
      destination: 'Australia',
      quote:
        'The platform saved me thousands of dollars in agent fees. The detailed pathway information and document checklists were incredibly helpful. I reached Australia in 6 months instead of the usual year!',
      image: '👨‍💼'
    },
    {
      name: 'Chen Wei',
      country: 'Taiwan',
      destination: 'Canada',
      quote:
        "As a professional, I needed quick answers. OmiHorizn delivered instant eligibility checks and personalized pathways. The professional services team guided me through every step. Highly recommended!",
      image: '👩‍💻'
    },
    {
      name: 'Sofia Santos',
      country: 'Brazil',
      destination: 'Portugal',
      quote:
        'OmiHorizn made my dream of moving to Portugal a reality. The platform showed me visa options I never knew existed. Their AI predictions were accurate, and the support team was phenomenal.',
      image: '👨‍🏫'
    },
    {
      name: 'Mohammed Al-Rashid',
      country: 'Saudi Arabia',
      destination: 'United Kingdom',
      quote:
        'The data-driven approach to visa planning is revolutionary. I made an informed decision with confidence. OmiHorizn is not just a tool; it\'s your personal migration advisor.',
      image: '👩‍🔬'
    },
    {
      name: 'Elena Popescu',
      country: 'Romania',
      destination: 'Netherlands',
      quote:
        'Clear, transparent, and empowering. That\'s OmiHorizn in three words. No hidden fees, no surprises, just pure guidance. Couldn\'t have done it without this platform.',
      image: '👨‍⚕️'
    }
  ];

  return (
    <div className="detailed-testimonials">
      <h2>Success Stories from Around the World</h2>

      <div className="testimonial-spotlight">
        <div className="testimonial-image">
          <span className="avatar">{testimonials[selectedTestimonial].image}</span>
        </div>
        <div className="testimonial-content">
          <blockquote>"{testimonials[selectedTestimonial].quote}"</blockquote>
          <div className="testimonial-author">
            <strong>{testimonials[selectedTestimonial].name}</strong>
            <span>
              {testimonials[selectedTestimonial].country} → {testimonials[selectedTestimonial].destination}
            </span>
          </div>
        </div>
      </div>

      <div className="testimonial-nav">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`testimonial-dot ${idx === selectedTestimonial ? 'active' : ''}`}
            onClick={() => setSelectedTestimonial(idx)}
            aria-label={`View testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const PlatformOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="platform-overview-page">
      {/* Hero */}
      <section className="overview-hero">
        <div className="hero-content">
          <h1>One Platform, Infinite Possibilities</h1>
          <p>
            Harness the power of AI-driven intelligence to unlock pathways to 145+ countries and achieve
            your global mobility dreams
          </p>
          <button className="cta-primary cta-large" onClick={() => navigate('/auth/signup')}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="section-features">
        <FeaturesComparison />
      </section>

      {/* How It Works */}
      <section className="section-how-it-works">
        <HowItWorks />
      </section>

      {/* Platform Benefits */}
      <section className="section-benefits">
        <PlatformBenefits />
      </section>

      {/* Detailed Testimonials */}
      <section className="section-testimonials">
        <DetailedTestimonials />
      </section>

      {/* Final CTA */}
      <section className="overview-cta">
        <h2>Ready to Explore Your Global Opportunities?</h2>
        <p>Join 50,000+ users who have transformed their migration journey with OmiHorizn</p>
        <div className="cta-buttons">
          <button className="cta-primary cta-large" onClick={() => navigate('/auth/signup')}>
            Sign Up for Free
          </button>
          <button className="cta-secondary cta-large" onClick={() => navigate('/pricing')}>
            View Pricing Plans
          </button>
        </div>
      </section>
    </div>
  );
};

export default PlatformOverviewPage;
