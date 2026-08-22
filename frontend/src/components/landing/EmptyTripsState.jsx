import React from 'react';
import { Compass, Plus } from 'lucide-react';

export function EmptyTripsState({ onPlanTrip, isLoggedIn, onOpenAuth }) {
  return (
    <div className="empty-trips-card">
      <div className="empty-trips-icon">
        <Compass size={36} />
      </div>
      <h3 className="empty-trips-heading">You haven't planned a trip yet.</h3>
      <p className="empty-trips-subtext">
        Start planning your first adventure. Explore worldwide destinations, budget your itinerary, and keep all details organized.
      </p>

      <div className="empty-trips-actions">
        <button type="button" className="btn-plan-cta" onClick={onPlanTrip}>
          <Plus size={18} />
          <span>Plan Your First Trip</span>
        </button>

        {!isLoggedIn && (
          <button type="button" className="btn-signin-secondary" onClick={onOpenAuth}>
            <span>Sign In to Sync Trips</span>
          </button>
        )}
      </div>
    </div>
  );
}
