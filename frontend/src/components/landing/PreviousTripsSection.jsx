import React from 'react';
import { TripCard } from './TripCard';
import { EmptyTripsState } from './EmptyTripsState';
import { Plane, AlertCircle, RefreshCw } from 'lucide-react';

export function PreviousTripsSection({
  trips,
  isLoading,
  error,
  onRetry,
  onPlanTrip,
  isLoggedIn,
  onOpenAuth,
}) {
  return (
    <section className="previous-trips-section" id="previous-trips">
      <div className="section-header">
        <div>
          <div className="section-subtitle">
            <Plane size={14} /> Personal Itineraries
          </div>
          <h2 className="section-title">Previous Trips</h2>
        </div>
        <p className="section-desc">
          Your saved personal journeys, itineraries, and past travel memories.
        </p>
      </div>

      {isLoading ? (
        <div className="trips-loading-skeleton">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : error ? (
        <div className="trips-error-state">
          <AlertCircle size={28} color="#EF4444" />
          <p>{error}</p>
          <button type="button" className="btn-retry" onClick={onRetry}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : trips && trips.length > 0 ? (
        <div className="previous-trips-grid">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyTripsState
          onPlanTrip={onPlanTrip}
          isLoggedIn={isLoggedIn}
          onOpenAuth={onOpenAuth}
        />
      )}
    </section>
  );
}
