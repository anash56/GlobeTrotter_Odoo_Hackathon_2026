import React from 'react';
import { Calendar, MapPin, ArrowRight, DollarSign, Clock } from 'lucide-react';

export function TripCard({ trip }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calculateDuration = (startStr, endStr) => {
    if (!startStr || !endStr) return null;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`;
  };

  const durationText = calculateDuration(trip.startDate, trip.endDate);
  const stopCount = trip.stops ? trip.stops.length : 0;
  const stopsText = stopCount === 1 ? '1 Stop' : `${stopCount} Stops`;

  const handleTripClick = () => {
    window.location.hash = `#trips-${trip.id}`;
  };

  return (
    <div className="trip-card" onClick={handleTripClick}>
      <div className="trip-card-image-wrapper">
        <img
          src={trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={trip.title}
          className="trip-card-image"
        />
        <div className="trip-card-badge">
          <MapPin size={12} /> {stopCount > 0 ? stopsText : 'Personal Trip'}
        </div>
      </div>

      <div className="trip-card-content">
        <h3 className="trip-card-title">{trip.title}</h3>
        
        {trip.description && (
          <p className="trip-card-description">{trip.description}</p>
        )}

        <div className="trip-card-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          </div>

          {durationText && (
            <div className="meta-item">
              <Clock size={14} />
              <span>Duration: {durationText}</span>
            </div>
          )}

          {trip.totalBudget > 0 && (
            <div className="meta-item budget">
              <DollarSign size={14} />
              <span>${trip.totalBudget.toLocaleString()} Total Budget</span>
            </div>
          )}
        </div>

        <button type="button" className="btn-view-trip" onClick={handleTripClick}>
          <span>View Trip Itinerary</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
