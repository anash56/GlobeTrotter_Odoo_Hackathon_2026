import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { CreateTripPage } from '../pages/CreateTripPage';
import { TripDetailsPage } from '../pages/TripDetailsPage';
import { BuildItineraryPage } from '../pages/BuildItineraryPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { useAuth } from '../context/AuthContext';

function LandingRouteWrapper() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <LandingPage
      currentUser={currentUser}
      onOpenAuth={() => navigate('/login')}
      onLogout={logoutUser}
    />
  );
}

function AuthRouteWrapper() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  return (
    <PublicRoute>
      <AuthPage
        onLoginSuccess={(user) => {
          loginUser(user);
          navigate('/dashboard');
        }}
      />
    </PublicRoute>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingRouteWrapper />} />
      <Route path="/landing" element={<LandingRouteWrapper />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<AuthRouteWrapper />} />
      <Route path="/signup" element={<AuthRouteWrapper />} />
      <Route path="/auth" element={<AuthRouteWrapper />} />

      {/* Main Logged-In User View (Renders Full Landing/Dashboard Page) */}
      <Route path="/dashboard" element={<LandingRouteWrapper />} />

      {/* Protected Routes inside Shared Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/trips/:id/itinerary" element={<BuildItineraryPage />} />
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
