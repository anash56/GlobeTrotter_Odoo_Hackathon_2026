import React, { useState } from 'react';
import { Compass, User, LogOut, PlusCircle, Menu, X } from 'lucide-react';

export function LandingNavbar({ currentUser, onOpenAuth, onLogout, onPlanTrip }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="landing-navbar">
      <div className="landing-nav-container">
        {/* Brand Logo */}
        <div className="landing-brand">
          <div className="brand-logo-icon">
            <Compass size={24} />
          </div>
          <span className="brand-logo-text">GlobeTrotter</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="landing-nav-links">
          <a href="#hero" className="nav-link active">Home</a>
          <a href="#destinations" className="nav-link">Explore / Destinations</a>
          <a href="#previous-trips" className="nav-link">My Trips</a>
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
          <a href="#hero" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#destinations" onClick={() => setIsMobileMenuOpen(false)}>Explore / Destinations</a>
          <a href="#previous-trips" onClick={() => setIsMobileMenuOpen(false)}>My Trips</a>
          <button type="button" onClick={() => { setIsMobileMenuOpen(false); onPlanTrip(); }}>+ Plan a Trip</button>
          {!currentUser && (
            <button type="button" onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}>Sign In / Register</button>
          )}
        </div>
      )}
    </header>
  );
}
