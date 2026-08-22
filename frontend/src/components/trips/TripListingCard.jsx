import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  Edit3, 
  CheckCircle, 
  Compass,
  Sparkles
} from 'lucide-react';

/**
 * Derives trip status from startDate and endDate relative to today (00:00:00 normalized)
 */
export function getTripStatus(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 'UPCOMING';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);

  if (start <= today && end >= today) {
    return 'ONGOING';
  } else if (start > today) {
    return 'UPCOMING';
  } else {
    return 'COMPLETED';
  }
}

/**
 * Calculates human-readable duration: e.g., "7 Days / 6 Nights"
 */
export function calculateTripDuration(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return '';
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const nights = Math.max(0, totalDays - 1);

  if (totalDays === 1) {
    return '1 Day';
  }
  return `${totalDays} Days / ${nights} Nights`;
}

/**
 * Formats a date string into "MMM d, yyyy"
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Derives destination route summary string from Trip stops
 */
export function getDestinationSummary(trip) {
  if (!trip?.stops || trip.stops.length === 0) {
    return 'Custom Destination';
  }

  const validStops = trip.stops.filter((s) => s.city?.name);
  if (validStops.length === 0) return 'Custom Destination';

  if (validStops.length === 1) {
    const city = validStops[0].city;
    return `${city.name}${city.country ? `, ${city.country}` : ''}`;
  }

  if (validStops.length <= 3) {
    return validStops.map((s) => s.city.name).join(' → ');
  }

  return `${validStops[0].city.name} + ${validStops.length - 1} more stops`;
}

export function TripListingCard({ trip }) {
  const navigate = useNavigate();

  const status = getTripStatus(trip.startDate, trip.endDate);
  const durationText = calculateTripDuration(trip.startDate, trip.endDate);
  const destinationText = getDestinationSummary(trip);

  const primaryCity = trip.stops?.[0]?.city;
  const coverImage =
    trip.coverPhotoUrl ||
    primaryCity?.imageUrl ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  const formattedBudget =
    typeof trip.totalBudget === 'number'
      ? `$${trip.totalBudget.toLocaleString()}`
      : '$0';

  const handleCardClick = () => {
    navigate(`/trips/${trip.id}`);
  };

  const handleContinuePlanning = (e) => {
    e.stopPropagation();
    navigate(`/trips/${trip.id}/itinerary`);
  };

  const handleViewTrip = (e) => {
    e.stopPropagation();
    navigate(`/trips/${trip.id}`);
  };

  return (
    <article
      className={`trip-listing-card status-${status.toLowerCase()}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      aria-label={`Trip: ${trip.title}, Status: ${status}`}
    >
      {/* Cover Image Container */}
      <div className="trip-card-media">
        <img
          src={coverImage}
          alt={trip.title}
          className="trip-card-image"
          loading="lazy"
        />
        <div className="trip-card-overlay" />

        {/* Dynamic Status Badge */}
        <div className={`trip-status-pill badge-${status.toLowerCase()}`}>
          {status === 'ONGOING' && <span className="live-dot" />}
          {status === 'UPCOMING' && <Sparkles size={13} />}
          {status === 'COMPLETED' && <CheckCircle size={13} />}
          <span>{status}</span>
        </div>

        {/* Destination Chip over media */}
        <div className="trip-destination-pill" title={destinationText}>
          <MapPin size={13} />
          <span className="dest-text">{destinationText}</span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="trip-card-body">
        <div className="trip-title-row">
          <h3 className="trip-card-heading" title={trip.title}>
            {trip.title}
          </h3>
        </div>

        {trip.description && (
          <p className="trip-card-description">{trip.description}</p>
        )}

        {/* Meta details list */}
        <div className="trip-meta-grid">
          <div className="trip-meta-item">
            <Calendar size={14} className="meta-icon" />
            <span className="meta-value">
              {formatDisplayDate(trip.startDate)} — {formatDisplayDate(trip.endDate)}
            </span>
          </div>

          {durationText && (
            <div className="trip-meta-item">
              <Clock size={14} className="meta-icon" />
              <span className="meta-value">{durationText}</span>
            </div>
          )}

          <div className="trip-meta-item budget-item">
            <DollarSign size={14} className="meta-icon" />
            <span className="meta-value font-semibold">Budget: {formattedBudget}</span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="trip-card-actions">
          <button
            type="button"
            className="btn-card-primary"
            onClick={handleViewTrip}
            title="View Trip Details"
          >
            <span>View Trip</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            className="btn-card-secondary"
            onClick={handleContinuePlanning}
            title="Continue planning and build itinerary"
          >
            <Edit3 size={14} />
            <span>{status === 'COMPLETED' ? 'Review Itinerary' : 'Continue Planning'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
