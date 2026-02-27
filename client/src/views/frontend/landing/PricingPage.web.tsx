import React, { useState } from 'react';
import { usePricingPlans } from '../../../hooks/usePricingPlans';
import { useNavigate } from 'react-router-dom';
import './PricingPage.css';

// pricing data now comes from backend via hook
interface DisplayPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // fetch pricing plans from API
  const { plans: apiPlans, loading, error } = usePricingPlans();


  const centsToEuros = (cents: number) => +(cents / 100).toFixed(2);

  const plans: DisplayPlan[] = apiPlans.map((p) => ({
    id: p.tier,
    name: p.name,
    price: billingCycle === 'monthly' ? centsToEuros(p.monthlyPrice) : centsToEuros(p.annualPrice),
    billingPeriod: billingCycle === 'monthly' ? 'Month' : 'Year',
    description: p.description,
    features: p.features,
    highlighted: p.highlighted,
    cta: p.cta
  }));

  const addOns: AddOn[] = apiPlans
    .flatMap((p) => p.addOns || [])
    .map((a) => ({ ...a, price: centsToEuros(a.price) }));

  const faqItems = [
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer:
        `Yes! You can change your plan at any time. If upgrading, you'll only pay the difference. If downgrading, credits will be applied to your account.`
    },
    {
      question: 'What is your refund policy?',
      answer:
        `We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact our support team for a full refund, no questions asked.`
    },
    {
      question: 'Do you offer team or corporate plans?',
      answer:
        `Yes! Organizations can contact our sales team for custom pricing and features tailored to your needs. Email sales@omihorizn.com for details.`
    },
    {
      question: 'Is there a contract or commitment required?',
      answer:
        `No contracts! All plans are month-to-month or annual with the flexibility to cancel anytime. You're never locked in.`
    },
    {
      question: `What payment methods do you accept?`,
      answer:
        `We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. Regional payment methods also available.`
    },
    {
      question: 'Can I use the free plan indefinitely?',
      answer:
        `Absolutely! The Free plan has no expiration. However, it's limited in features. Most users upgrade to Premium or Professional for better results.`
    },
    {
      question: 'How does the annual discount work?',
      answer:
        'Annual plans save you 20% compared to monthly billing. For example, Premium annual is €199.99 (vs €239.88 monthly), saving you €40.'
    },
    {
      question: 'What support is included with each plan?',
      answer:
        'Free: Email support. Premium: Email + chat (2-4 hour response). Professional: Priority phone + video support (1-hour response time).'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  if (loading) return <div>Loading pricing...</div>;
  if (error) return <div className="pricing-error">{error}</div>;

  return (
    <div className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that's right for your journey</p>
      </section>

      {/* Billing Toggle */}
      <section className="billing-toggle-section">
        <div className="billing-toggle">
          <button
            className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual
            <span className="save-badge">Save 20%</span>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
              {plan.highlighted && <div className="popular-badge">Most Popular</div>}

              <h2>{plan.name}</h2>
              <p className="plan-description">{plan.description}</p>

              <div className="price">
                <span className="currency">€</span>
                <span className="amount">{plan.price.toFixed(2)}</span>
                <span className="period">/{plan.billingPeriod}</span>
              </div>

              <button
                className={`plan-cta ${plan.highlighted ? 'cta-primary' : 'cta-secondary'}`}
                onClick={() => navigate('/auth/signup')}
              >
                {plan.cta}
              </button>

              <div className="features-list">
                <p className="features-title">Includes:</p>
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {plan.id === 'free' && (
                <div className="plan-note">
                  <strong>Perfect for:</strong> Exploring options and learning about pathways
                </div>
              )}
              {plan.id === 'premium' && (
                <div className="plan-note">
                  <strong>Perfect for:</strong> Serious applicants ready to take next steps
                </div>
              )}
              {plan.id === 'professional' && (
                <div className="plan-note">
                  <strong>Perfect for:</strong> Committed applicants needing expert guidance
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="comparison-table-section">
        <h2>Feature Comparison</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Premium</th>
                <th>Professional</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Countries Accessible</td>
                <td>Limited</td>
                <td>All 145+</td>
                <td>All 145+</td>
              </tr>
              <tr>
                <td>AI Eligibility Assessment</td>
                <td>1 country</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Visa Pathways Compared</td>
                <td>1</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Document Checklists</td>
                <td>Basic</td>
                <td>Complete</td>
                <td>Complete + Custom</td>
              </tr>
              <tr>
                <td>Timeline Predictions</td>
                <td>No</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Advisor Sessions</td>
                <td>None</td>
                <td>None</td>
                <td>30 min/month</td>
              </tr>
              <tr>
                <td>1:1 Consultations</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Interview Prep</td>
                <td>No</td>
                <td>No</td>
                <td>5 sessions/month</td>
              </tr>
              <tr>
                <td>Application Review</td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Email</td>
                <td>Email + Chat</td>
                <td>Phone + Video</td>
              </tr>
              <tr>
                <td>Response Time</td>
                <td>24-48 hours</td>
                <td>2-4 hours</td>
                <td>1 hour</td>
              </tr>
              <tr>
                <td>Saved Profiles</td>
                <td>1</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Add-ons */}
      <section className="addons-section">
        <h2>Boost Your Plan with Add-ons</h2>
        <div className="addons-grid">
          {addOns.map((addon) => (
            <div key={addon.id} className="addon-card">
              <h3>{addon.name}</h3>
              <p>{addon.description}</p>
              <div className="addon-price">
                <span className="currency">€</span>
                <span className="amount">{addon.price}</span>
              </div>
              <button className="addon-btn">Add to Plan</button>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantees */}
      <section className="guarantees-section">
        <div className="guarantee-box">
          <span className="guarantee-icon">🛡️</span>
          <h3>30-Day Money-Back Guarantee</h3>
          <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
        </div>
        <div className="guarantee-box">
          <span className="guarantee-icon">🔒</span>
          <h3>Data Privacy & Security</h3>
          <p>Enterprise-grade encryption. Your data is safe and never shared with third parties.</p>
        </div>
        <div className="guarantee-box">
          <span className="guarantee-icon">⏸️</span>
          <h3>Pause Anytime</h3>
          <p>Need a break? Pause your subscription for up to 3 months without losing access.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqItems.map((item, idx) => (
            <div key={idx} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setExpandedFaq(expandedFaq === idx.toString() ? null : idx.toString())}
              >
                <span>{item.question}</span>
                <span className={`faq-icon ${expandedFaq === idx.toString() ? 'open' : ''}`}>+</span>
              </button>
              {expandedFaq === idx.toString() && <div className="faq-answer">{item.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pricing-final-cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of successful migrants on OmiHorizn</p>
        <button className="cta-primary cta-large" onClick={() => navigate('/auth/signup')}>
          Start Your Free Trial
        </button>
      </section>
    </div>
  );
};

export default PricingPage;
