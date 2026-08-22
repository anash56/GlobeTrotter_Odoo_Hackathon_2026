import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="app-loading-screen">
        <div className="spinner-navy" />
        <p>Loading GlobeTrotter...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
