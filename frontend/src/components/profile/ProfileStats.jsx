import React from 'react';
import { Compass, Calendar, CheckCircle2, MapPin } from 'lucide-react';

export function ProfileStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="profile-stats-grid">
      <div className="profile-stat-card">
        <div className="stat-icon-box stat-icon-blue">
          <Compass size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{stats.totalTrips || 0}</span>
          <span className="stat-label">Total Trips Planned</span>
        </div>
      </div>

      <div className="profile-stat-card">
        <div className="stat-icon-box stat-icon-sky">
          <Calendar size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{stats.upcomingTripsCount || 0}</span>
          <span className="stat-label">Upcoming Adventures</span>
        </div>
      </div>

      <div className="profile-stat-card">
        <div className="stat-icon-box stat-icon-green">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{stats.previousTripsCount || 0}</span>
          <span className="stat-label">Completed Trips</span>
        </div>
      </div>

      <div className="profile-stat-card">
        <div className="stat-icon-box stat-icon-sand">
          <MapPin size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{stats.destinationsVisited || 0}</span>
          <span className="stat-label">Destinations Visited</span>
        </div>
      </div>
    </div>
  );
}
