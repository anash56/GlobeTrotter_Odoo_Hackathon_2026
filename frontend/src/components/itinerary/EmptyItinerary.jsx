import React from 'react';
import { Compass, Plus, MapPin } from 'lucide-react';

export function EmptyItinerary({ onAddStop }) {
  return (
    <div className="empty-itinerary-card">
      <div className="empty-icon-wrapper">
        <Compass size={40} />
      </div>
      <h3 className="empty-title">No destinations added yet.</h3>
      <p className="empty-desc">
        Start building your day-by-day itinerary by adding your first trip stop or destination city.
      </p>
      <button type="button" className="btn-primary-cta" onClick={onAddStop}>
        <Plus size={18} />
        <span>Add Destination Stop</span>
      </button>
    </div>
  );
}
