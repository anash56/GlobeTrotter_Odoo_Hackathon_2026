import React from 'react';
import { MapPin, Calendar, Clock, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfileTripCard({ trip, isUpcoming = true }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = () => {
    if (!trip.startDate || !trip.endDate) return 1;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const primaryCity = trip.stops?.[0]?.city;
  const destinationText = primaryCity
    ? `${primaryCity.name}, ${primaryCity.country}`
    : 'Multi-Destination';
  const coverImage =
    trip.coverPhotoUrl ||
    primaryCity?.imageUrl ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="profile-trip-card">
      <div className="trip-card-image-wrapper">
        <img src={coverImage} alt={trip.title} className="trip-card-img" />
        <div className="trip-card-badge-overlay">
          {isUpcoming ? (
            <span className="badge-status badge-upcoming">
              <Sparkles size={12} /> Upcoming
            </span>
          ) : (
            <span className="badge-status badge-completed">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="trip-card-body">
        <div className="trip-destination-row">
          <MapPin size={15} className="dest-icon" />
          <span>{destinationText}</span>
        </div>

        <h3 className="trip-card-title">{trip.title}</h3>

        {trip.description && (
          <p className="trip-card-desc">{trip.description}</p>
        )}

        <div className="trip-card-meta-grid">
          <div className="meta-info-item">
            <Calendar size={14} />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>

          <div className="meta-info-item">
            <Clock size={14} />
            <span>{calculateDays()} Days</span>
          </div>

          {trip.totalBudget > 0 && (
            <div className="meta-info-item budget-tag">
              <DollarSign size={14} />
              <span>${trip.totalBudget.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="trip-card-actions">
          <button
            type="button"
            className="btn-card-primary"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            View Trip Details
          </button>
          
          {isUpcoming && (
            <button
              type="button"
              className="btn-card-secondary"
              onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
            >
              Build Itinerary <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
