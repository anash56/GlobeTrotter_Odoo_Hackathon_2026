import React from 'react';
import { Compass, Star, MapPin, Sparkles } from 'lucide-react';

export function TravelShowcase() {
  const destinations = [
    {
      id: 1,
      name: 'Santorini, Greece',
      subtitle: '5 Days AI Itinerary Ready',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      name: 'Kyoto, Japan',
      subtitle: 'Cherry Blossom Expedition',
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      name: 'Swiss Alps, Switzerland',
      subtitle: 'Mountain Trek & Luxury Stay',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="showcase-section">
      <div className="showcase-overlay" />
      
      <div className="showcase-content">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-icon-wrapper">
            <Compass size={26} />
          </div>
          <span className="brand-title">GlobeTrotter</span>
        </div>

        {/* Hero Section */}
        <div className="showcase-hero">
          <div className="showcase-tag">
            <Sparkles size={14} /> AI-Powered Travel Planning
          </div>
          <h1 className="showcase-heading">
            Design Your Next <br />
            Unforgettable Adventure
          </h1>
          <p className="showcase-subtext">
            Craft tailored itineraries, budget personal trips, and discover hidden gems across the globe in seconds.
          </p>

          {/* Floating Travel Cards */}
          <div className="floating-cards-container">
            {destinations.map((item) => (
              <div key={item.id} className="destination-card">
                <img src={item.image} alt={item.name} className="destination-img" />
                <div className="destination-info">
                  <h4>{item.name}</h4>
                  <p>{item.subtitle}</p>
                </div>
                <div className="destination-badge">
                  <Star size={14} fill="#FBBF24" color="#FBBF24" />
                  <span>{item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Showcase Footer */}
        <div className="showcase-footer">
          <div className="traveler-avatars">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User" 
              className="avatar" 
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
              alt="User" 
              className="avatar" 
            />
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
              alt="User" 
              className="avatar" 
            />
            <div className="avatar-count">+15k</div>
          </div>
          <p className="stats-label">
            Joined by <strong>15,000+ globetrotters</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
