import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WebFooter.css';

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

const WebFooter: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    { label: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { label: 'Instagram', url: 'https://instagram.com', icon: '📸' },
    { label: 'Facebook', url: 'https://facebook.com', icon: 'f' }
  ];

  const footerLinks = {
    Product: [
      { label: 'Features', path: '/' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Platform', path: '/platform' },
      { label: 'Countries', path: '/countries' }
    ],
    Company: [
      { label: 'About Us', path: '/' },
      { label: 'Blog', path: '/' },
      { label: 'Careers', path: '/' },
      { label: 'Contact', path: '/' }
    ],
    Legal: [
      { label: 'Privacy Policy', path: '/' },
      { label: 'Terms of Service', path: '/' },
      { label: 'Cookie Policy', path: '/' },
      { label: 'Data Protection', path: '/' }
    ]
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');
    try {
      // TODO: Integrate with backend newsletter API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (error) {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  return (
    <footer className="web-footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h3>Stay Updated with Global Mobility Insights</h3>
          <p>Get weekly tips, visa updates, and success stories delivered to your inbox</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              disabled={subscribeStatus === 'loading'}
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={subscribeStatus === 'loading'}
            >
              {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {subscribeStatus === 'success' && (
            <p className="newsletter-success">✓ Successfully subscribed!</p>
          )}
          {subscribeStatus === 'error' && (
            <p className="newsletter-error">✗ Subscription failed. Please try again.</p>
          )}
          <p className="newsletter-note">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-columns">
          {/* Brand Column */}
          <div className="footer-column">
            <div className="footer-brand">
              <span className="footer-logo-icon">🌍</span>
              <span className="footer-brand-name">OmiHorizn</span>
            </div>
            <p className="footer-description">
              Global mobility intelligence platform powered by AI. Make informed migration decisions independently.
            </p>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-column">
              <h4 className="footer-column-title">{category}</h4>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      className="footer-link"
                      onClick={() => navigate(link.path)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {currentYear} OmiHorizn. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <a href="/" className="footer-bottom-link">Privacy</a>
            <span className="divider">•</span>
            <a href="/" className="footer-bottom-link">Terms</a>
            <span className="divider">•</span>
            <a href="/" className="footer-bottom-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WebFooter;
