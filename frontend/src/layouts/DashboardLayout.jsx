import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Compass, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Shared Navbar */}
      <header className="dashboard-navbar">
        <Link to="/dashboard" className="nav-brand" style={{ textDecoration: 'none' }}>
          <Compass size={24} className="brand-logo" />
          <span className="brand-title">GlobeTrotter</span>
        </Link>

        <div className="nav-actions">
          <Link to="/trips/create" className="btn-create-trip-nav" style={{ textDecoration: 'none' }}>
            <Plus size={18} /> Plan a New Trip
          </Link>

          {currentUser && (
            <div className="user-dropdown">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="nav-avatar"
              />
              <span className="user-name">{currentUser.name}</span>
              <button type="button" className="btn-logout-icon" onClick={handleLogout} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Nested Page Content */}
      <Outlet />
    </div>
  );
}
