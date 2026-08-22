import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Plus, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isMyTripsActive = location.pathname === '/my-trips' || location.pathname === '/trips';

  return (
    <div className="dashboard-layout">
      {/* Shared Navbar */}
      <header className="dashboard-navbar">
        <div className="nav-left-group">
          <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-logo-icon">
              <Compass size={24} />
            </div>
            <span className="brand-title">GlobeTrotter</span>
          </Link>

          {/* Main Navigation Links */}
          <nav className="dashboard-nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/landing' ? 'active' : ''}`}>
              Home
            </Link>
            <a href="/#destinations" className="nav-link">
              Explore / Destinations
            </a>
            <Link to="/my-trips" className={`nav-link ${isMyTripsActive ? 'active' : ''}`}>
              My Trips
            </Link>
          </nav>
        </div>

        <div className="nav-actions">
          <Link to="/trips/create" className="btn-create-trip-nav" style={{ textDecoration: 'none' }}>
            <Plus size={16} /> <span>Plan a Trip</span>
          </Link>

          {currentUser ? (
            <div className="user-dropdown">
              <Link to="/profile" className="profile-nav-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="user-avatar-circle">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="nav-avatar"
                    />
                  ) : (
                    <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <span className="user-name">{currentUser.name}</span>
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
        <div className="mobile-nav-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="/#destinations" onClick={() => setMobileMenuOpen(false)}>Explore / Destinations</a>
          <Link to="/my-trips" className={isMyTripsActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>My Trips</Link>
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
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

      {/* Dynamic Nested Page Content */}
      <Outlet />
    </div>
  );
}
