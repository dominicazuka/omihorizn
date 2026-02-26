import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WebHeader.css';

interface NavLink {
  label: string;
  path: string;
}

const WebHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Platform', path: '/platform' },
    { label: 'Countries', path: '/countries' },
    { label: 'Pricing', path: '/pricing' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="web-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo" onClick={() => handleNavigation('/')}>
          <span className="logo-icon">🌍</span>
          <span className="logo-text">OmiHorizn</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(link.path)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth & Newsletter */}
        <div className="header-actions">
          <div className="newsletter-signup-small">
            <input type="email" placeholder="Your email" className="newsletter-input-small" />
            <button className="newsletter-btn-small">Subscribe</button>
          </div>
          <button className="auth-btn login-btn" onClick={() => navigate('/auth/login')}>
            Log In
          </button>
          <button className="auth-btn signup-btn" onClick={() => navigate('/auth/signup')}>
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            ☰
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(link.path)}
            >
              {link.label}
            </button>
          ))}
          <button className="auth-btn login-btn" onClick={() => navigate('/auth/login')}>
            Log In
          </button>
          <button className="auth-btn signup-btn" onClick={() => navigate('/auth/signup')}>
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default WebHeader;
