import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavbar } from '../components/navigation/AppNavbar';

export function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Shared Unified Navbar */}
      <AppNavbar />

      {/* Dynamic Nested Page Content */}
      <Outlet />
    </div>
  );
}
