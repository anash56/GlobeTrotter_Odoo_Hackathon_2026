import React from 'react';
import { ArrowLeft, Compass, CheckCircle2, MapPin, Calendar } from 'lucide-react';

export function ItineraryHeader({ trip, onBack, isSaving }) {
  return (
    <header className="itinerary-header">
      <div className="itinerary-header-left">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back to Trip Details</span>
        </button>
        {trip && (
          <div className="header-trip-info">
            <h2 className="header-title">{trip.title}</h2>
            <div className="header-subtitle-row">
              <span className="header-badge">
                <MapPin size={13} /> {trip.stops?.[0]?.city?.name || 'Multi-City'}
              </span>
              <span className="header-badge">
                <Calendar size={13} /> Itinerary Builder
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="itinerary-header-right">
        <div className="save-status-indicator">
          {isSaving ? (
            <span className="status-saving">
              <span className="spinner-sm" /> Saving changes...
            </span>
          ) : (
            <span className="status-saved">
              <CheckCircle2 size={16} color="#10B981" /> All Changes Saved
            </span>
          )}
        </div>
        <div className="brand-badge">
          <Compass size={20} className="brand-icon" />
          <span className="brand-text">GlobeTrotter</span>
        </div>
      </div>
    </header>
  );
}
