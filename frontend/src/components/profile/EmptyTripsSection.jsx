import React from 'react';
import { Compass, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EmptyTripsSection({ type = 'upcoming' }) {
  const navigate = useNavigate();

  if (type === 'upcoming') {
    return (
      <div className="empty-trips-card">
        <div className="empty-trips-icon">
          <Compass size={36} />
        </div>
        <h4 className="empty-trips-title">You haven't planned your next adventure yet.</h4>
        <p className="empty-trips-desc">
          Discover world destinations, customize your day-by-day itinerary, and calculate travel budgets.
        </p>
        <button
          type="button"
          className="btn-create-trip-cta"
          onClick={() => navigate('/trips/create')}
        >
          <Plus size={16} /> Plan a Trip
        </button>
      </div>
    );
  }

  return (
    <div className="empty-trips-card">
      <div className="empty-trips-icon">
        <Calendar size={36} />
      </div>
      <h4 className="empty-trips-title">No previous trips yet.</h4>
      <p className="empty-trips-desc">
        Your completed travel itineraries and past vacations will appear here after your trip dates conclude.
      </p>
    </div>
  );
}
