import React from 'react';
import { Sparkles, Plus, MapPin } from 'lucide-react';

export function HeroBanner({ onPlanTrip }) {
  return (
    <section className="hero-banner-section" id="hero">
      <div className="hero-banner-card">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered Travel Companion</span>
          </div>

          <h1 className="hero-title">
            Plan Your Next Adventure
          </h1>

          <p className="hero-subtitle">
            Discover destinations, create personalized trips, and build unforgettable itineraries with GlobeTrotter.
          </p>

          <div className="hero-actions">
            <button type="button" className="btn-hero-cta" onClick={onPlanTrip}>
              <Plus size={18} />
              <span>Plan a Trip</span>
            </button>
            
            <a href="#search-section" className="btn-hero-secondary">
              <MapPin size={16} />
              <span>Explore Destinations</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
