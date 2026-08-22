import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Edit3, 
  Compass, 
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';
import { getTripStatus, calculateTripDuration, formatDisplayDate, getDestinationSummary } from '../trips/TripListingCard';

export function CalendarEventDrawer({
  selectedTrip,
  selectedDayData,
  onClose,
}) {
  const navigate = useNavigate();

  if (!selectedTrip && !selectedDayData) return null;

  const trip = selectedTrip || (selectedDayData?.trips && selectedDayData.trips[0]);

  const status = trip ? getTripStatus(trip.startDate, trip.endDate) : 'UPCOMING';
  const durationText = trip ? calculateTripDuration(trip.startDate, trip.endDate) : '';
  const destinationText = trip ? getDestinationSummary(trip) : 'Destination';

  const primaryCity = trip?.stops?.[0]?.city;
  const coverImage =
    trip?.coverPhotoUrl ||
    primaryCity?.imageUrl ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  const formattedBudget =
    trip && typeof trip.totalBudget === 'number'
      ? `$${trip.totalBudget.toLocaleString()}`
      : '$0';

  // Gather all activities across stops
  const allActivities = [];
  trip?.stops?.forEach((stop) => {
    stop.activities?.forEach((act) => {
      allActivities.push({
        ...act,
        cityName: stop.city?.name || 'Stop',
      });
    });
  });

  return (
    <aside className="calendar-event-drawer" aria-label="Trip Event Details">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel">
        {/* Drawer Header Close */}
        <div className="drawer-top-bar">
          <span className="drawer-tag">
            <Compass size={14} /> Travel Itinerary
          </span>
          <button
            type="button"
            className="btn-drawer-close"
            onClick={onClose}
            aria-label="Close event details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Cover Banner */}
        <div className="drawer-media">
          <img src={coverImage} alt={trip?.title || 'Trip Cover'} className="drawer-cover-img" />
          <div className="drawer-media-overlay" />

          {/* Status Badge */}
          <div className={`trip-status-pill badge-${status.toLowerCase()}`}>
            {status === 'ONGOING' && <span className="live-dot" />}
            {status === 'UPCOMING' && <Sparkles size={13} />}
            {status === 'COMPLETED' && <CheckCircle2 size={13} />}
            <span>{status}</span>
          </div>

          <div className="drawer-dest-pill">
            <MapPin size={14} />
            <span>{destinationText}</span>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          <h2 className="drawer-trip-title">{trip?.title}</h2>
          {trip?.description && (
            <p className="drawer-trip-desc">{trip.description}</p>
          )}

          {/* Metadata Grid */}
          <div className="drawer-meta-box">
            <div className="drawer-meta-row">
              <Calendar size={15} className="drawer-meta-icon" />
              <div className="drawer-meta-content">
                <span className="label">Travel Dates</span>
                <span className="value font-semibold">
                  {formatDisplayDate(trip?.startDate)} — {formatDisplayDate(trip?.endDate)}
                </span>
              </div>
            </div>

            {durationText && (
              <div className="drawer-meta-row">
                <Clock size={15} className="drawer-meta-icon" />
                <div className="drawer-meta-content">
                  <span className="label">Duration</span>
                  <span className="value">{durationText}</span>
                </div>
              </div>
            )}

            <div className="drawer-meta-row">
              <DollarSign size={15} className="drawer-meta-icon" />
              <div className="drawer-meta-content">
                <span className="label">Total Budget</span>
                <span className="value font-bold text-navy">{formattedBudget}</span>
              </div>
            </div>
          </div>

          {/* Stops and Activities Section */}
          <div className="drawer-activities-section">
            <div className="section-subheading">
              <Layers size={15} />
              <h3>Trip Stops & Activities ({allActivities.length})</h3>
            </div>

            {allActivities.length > 0 ? (
              <div className="drawer-activities-list">
                {allActivities.map((act, idx) => (
                  <div key={act.id || idx} className="drawer-activity-item">
                    <div className="act-bullet" />
                    <div className="act-details">
                      <div className="act-name-row">
                        <span className="act-name">{act.customName || act.activity?.name || 'Scheduled Activity'}</span>
                        <span className="act-category-pill">{act.category}</span>
                      </div>
                      <div className="act-sub-meta">
                        <span>{act.cityName}</span>
                        {act.cost > 0 && <span>• ${act.cost}</span>}
                        {act.startTime && <span>• {act.startTime}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="drawer-empty-activities">
                <p>No custom activities scheduled yet for this trip.</p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="drawer-actions-row">
            <button
              type="button"
              className="btn-drawer-primary"
              onClick={() => {
                if (trip?.id) navigate(`/trips/${trip.id}`);
              }}
            >
              <span>View Trip Details</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-drawer-secondary"
              onClick={() => {
                if (trip?.id) navigate(`/trips/${trip.id}/itinerary`);
              }}
            >
              <Edit3 size={15} />
              <span>Itinerary Builder</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
