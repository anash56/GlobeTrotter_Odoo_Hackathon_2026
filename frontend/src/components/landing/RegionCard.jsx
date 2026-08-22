import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

export function RegionCard({ region, onClick }) {
  return (
    <div className="region-card" onClick={() => onClick(region.name)}>
      <img src={region.imageUrl} alt={region.name} className="region-card-image" />
      <div className="region-card-overlay" />
      <div className="region-card-body">
        <span className="region-card-count">
          <MapPin size={12} /> {region.count} {region.count === 1 ? 'Destination' : 'Destinations'}
        </span>
        <h3 className="region-card-name">{region.name}</h3>
        <p className="region-card-description">{region.description}</p>
        <div className="region-card-action">
          <span>Explore Region</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
