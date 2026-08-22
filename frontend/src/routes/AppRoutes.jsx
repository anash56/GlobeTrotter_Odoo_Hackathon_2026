import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { MyTripsPage } from '../pages/MyTripsPage';
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

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingRouteWrapper />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes inside Shared Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/trips" element={<MyTripsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/trips/:id/itinerary" element={<BuildItineraryPage />} />
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
