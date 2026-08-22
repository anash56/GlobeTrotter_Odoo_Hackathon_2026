import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, LogOut, PlusCircle, Menu, X } from 'lucide-react';

export function LandingNavbar({ currentUser, onOpenAuth, onLogout, onPlanTrip, activePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="landing-navbar">
      <div className="landing-nav-container">
        {/* Brand Logo */}
        <div className="landing-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">
            <Compass size={24} />
          </div>
          <span className="brand-logo-text">GlobeTrotter</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="landing-nav-links">
          <Link to="/dashboard" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>Home</Link>
          <Link to="/explore" className={`nav-link ${activePage === 'explore' ? 'active' : ''}`}>Explore / Destinations</Link>
          <Link to="/community" className={`nav-link ${activePage === 'community' ? 'active' : ''}`}>Community</Link>
          <Link to="/dashboard#previous-trips" className={`nav-link ${activePage === 'trips' ? 'active' : ''}`}>My Trips</Link>
        </nav>

        {/* Desktop Nav Actions */}
        <div className="landing-nav-actions">
          <button type="button" className="btn-plan-header" onClick={onPlanTrip}>
            <PlusCircle size={16} />
            <span>Plan a Trip</span>
          </button>

          {currentUser ? (
            <div className="user-profile-badge">
              <div className="avatar-circle">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} />
                ) : (
                  <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <span className="user-name-text">{currentUser.name}</span>
              <button
                type="button"
                className="btn-logout-icon"
                onClick={onLogout}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button type="button" className="btn-signin-nav" onClick={onOpenAuth}>
              <User size={16} />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)}>Explore / Destinations</Link>
          <Link to="/community" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
          <Link to="/dashboard#previous-trips" onClick={() => setIsMobileMenuOpen(false)}>My Trips</Link>
          <button type="button" onClick={() => { setIsMobileMenuOpen(false); onPlanTrip(); }}>+ Plan a Trip</button>
          {!currentUser && (
            <button type="button" onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}>Sign In / Register</button>
          )}
        </div>
      )}
    </header>
  );
}
