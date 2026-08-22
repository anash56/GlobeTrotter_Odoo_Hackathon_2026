import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CreateTripPage } from '../pages/CreateTripPage';
import { TripDetailsPage } from '../pages/TripDetailsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
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
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
      </Route>

      {/* Base Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
