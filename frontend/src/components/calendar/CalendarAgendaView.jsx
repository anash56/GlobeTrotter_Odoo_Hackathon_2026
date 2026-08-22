import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, ArrowRight, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { getTripStatus, calculateTripDuration, formatDisplayDate, getDestinationSummary } from '../trips/TripListingCard';

export function CalendarAgendaView({
  trips,
  currentDate,
  onSelectTrip,
}) {
  const navigate = useNavigate();

  // Filter trips that touch the current month or show all sorted
  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthTrips = trips.filter((trip) => {
    if (!trip.startDate || !trip.endDate) return false;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const mStart = new Date(currentYear, currentMonthIdx, 1);
    const mEnd = new Date(currentYear, currentMonthIdx + 1, 0, 23, 59, 59);

    return start <= mEnd && end >= mStart;
  });

  const displayList = monthTrips.length > 0 ? monthTrips : trips;

  if (displayList.length === 0) {
    return (
      <div className="agenda-empty-box">
        <p>No trips or scheduled itinerary items found for this period.</p>
      </div>
    );
  }

  return (
    <div className="calendar-agenda-container">
      <div className="agenda-timeline">
        {displayList.map((trip) => {
          const status = getTripStatus(trip.startDate, trip.endDate);
          const duration = calculateTripDuration(trip.startDate, trip.endDate);
          const destination = getDestinationSummary(trip);
          const primaryCity = trip.stops?.[0]?.city;
          const coverImage =
            trip.coverPhotoUrl ||
            primaryCity?.imageUrl ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

          const allActivities = [];
          trip.stops?.forEach((s) => {
            s.activities?.forEach((a) => {
              allActivities.push({
                ...a,
                cityName: s.city?.name,
              });
            });
          });

          return (
            <article
              key={trip.id}
              className={`agenda-card status-${status.toLowerCase()}`}
              onClick={() => onSelectTrip(trip)}
            >
              {/* Cover Image thumbnail */}
              <div className="agenda-thumb-wrap">
                <img src={coverImage} alt={trip.title} className="agenda-thumb-img" />
                <span className={`agenda-status-badge badge-${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>

              {/* Main agenda info */}
              <div className="agenda-content">
                <div className="agenda-header-row">
                  <h3 className="agenda-title">{trip.title}</h3>
                  <span className="agenda-budget">${trip.totalBudget?.toLocaleString()}</span>
                </div>

                <div className="agenda-meta-row">
                  <span className="agenda-meta-item">
                    <MapPin size={13} /> {destination}
                  </span>
                  <span className="agenda-meta-item">
                    <Calendar size={13} /> {formatDisplayDate(trip.startDate)} — {formatDisplayDate(trip.endDate)}
                  </span>
                  {duration && (
                    <span className="agenda-meta-item">
                      <Clock size={13} /> {duration}
                    </span>
                  )}
                </div>

                {allActivities.length > 0 && (
                  <div className="agenda-activities-preview">
                    <span className="preview-label">Activities ({allActivities.length}):</span>
                    <div className="activity-chips-row">
                      {allActivities.slice(0, 3).map((act, i) => (
                        <span key={i} className="activity-tag">
                          {act.customName || act.activity?.name || 'Activity'}
                        </span>
                      ))}
                      {allActivities.length > 3 && (
                        <span className="activity-tag-more">+{allActivities.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="agenda-action-col">
                <button
                  type="button"
                  className="btn-agenda-view"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trips/${trip.id}`);
                  }}
                >
                  <span>View Trip</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
