import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Plus, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AppNavbar() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isHomeActive = location.pathname === '/' || location.pathname === '/landing';
  const isMyTripsActive = location.pathname === '/my-trips' || location.pathname === '/trips';
  const isCalendarActive = location.pathname === '/calendar';
  const isProfileActive = location.pathname === '/profile';

  return (
    <>
      <header className="dashboard-navbar" role="banner">
        <div className="nav-left-group">
          {/* Brand Logo */}
          <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }} aria-label="GlobeTrotter Home">
            <div className="brand-logo-icon">
              <Compass size={24} />
            </div>
            <span className="brand-title">GlobeTrotter</span>
          </Link>

          {/* Main Navigation Links */}
          <nav className="dashboard-nav-links" aria-label="Main Navigation">
            <Link to="/" className={`nav-link ${isHomeActive ? 'active' : ''}`}>
              Home
            </Link>
            <a href="/#destinations" className="nav-link">
              Explore / Destinations
            </a>
            <Link to="/my-trips" className={`nav-link ${isMyTripsActive ? 'active' : ''}`}>
              My Trips
            </Link>
            <Link to="/calendar" className={`nav-link ${isCalendarActive ? 'active' : ''}`}>
              Calendar
            </Link>
          </nav>
        </div>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          <Link to="/trips/create" className="btn-create-trip-nav" style={{ textDecoration: 'none' }}>
            <Plus size={16} /> <span>Plan a Trip</span>
          </Link>

          {currentUser ? (
            <div className="user-dropdown">
              <Link 
                to="/profile" 
                className={`profile-nav-link ${isProfileActive ? 'active' : ''}`}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                title="View Profile"
              >
                <div className="user-avatar-circle">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name || 'User'}
                      className="nav-avatar"
                    />
                  ) : (
                    <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <span className="user-name">{currentUser.name || 'Account'}</span>
              </Link>
              <button 
                type="button" 
                className="btn-logout-icon" 
                onClick={handleLogout} 
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-signin-nav" style={{ textDecoration: 'none' }}>
              <User size={16} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation" aria-label="Mobile Navigation">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="/#destinations" onClick={() => setMobileMenuOpen(false)}>Explore / Destinations</a>
          <Link to="/my-trips" className={isMyTripsActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>My Trips</Link>
          <Link to="/calendar" className={isCalendarActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
          <Link to="/profile" className={isProfileActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
          <Link to="/trips/create" onClick={() => setMobileMenuOpen(false)}>+ Plan a Trip</Link>
          {currentUser ? (
            <button type="button" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
              Sign Out ({currentUser.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In / Register</Link>
          )}
        </div>
      )}
    </>
  );
}
