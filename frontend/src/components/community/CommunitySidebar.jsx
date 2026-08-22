import React from 'react';
import { Compass, Sparkles, MapPin, MessageSquare, PlusCircle, ShieldCheck, Heart } from 'lucide-react';

export function CommunitySidebar({ onOpenCreateModal, currentUser }) {
  return (
    <aside className="community-sidebar-container">
      {/* 1. About the Community Card */}
      <div className="sidebar-card about-community-card">
        <div className="sidebar-card-header">
          <Compass size={22} className="sidebar-icon" />
          <h3>About the Community</h3>
        </div>
        <p className="sidebar-desc">
          Welcome to the GlobeTrotter travel hub! Connect with fellow explorers, exchange itinerary tips, discover hidden local spots, and share your authentic travel moments.
        </p>

        <div className="sidebar-features-list">
          <div className="feature-item">
            <Sparkles size={16} className="feature-icon" />
            <div>
              <strong>Share Experiences</strong>
              <p>Post photos, reviews, and stories from your latest trips.</p>
            </div>
          </div>

          <div className="feature-item">
            <MapPin size={16} className="feature-icon" />
            <div>
              <strong>Destination Advice</strong>
              <p>Get authentic recommendations from local experts and travelers.</p>
            </div>
          </div>

          <div className="feature-item">
            <MessageSquare size={16} className="feature-icon" />
            <div>
              <strong>Plan Together</strong>
              <p>Ask questions and build itineraries with community insights.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-sidebar-create"
          onClick={onOpenCreateModal}
        >
          <PlusCircle size={16} /> Share Your Story
        </button>
      </div>

      {/* 2. Community Guidelines Card */}
      <div className="sidebar-card guidelines-card">
        <div className="sidebar-card-header">
          <ShieldCheck size={20} className="sidebar-icon" />
          <h3>Community Guidelines</h3>
        </div>
        <ul className="guidelines-list">
          <li>✨ Be respectful, supportive, and welcoming to all travelers.</li>
          <li>📍 Share real destinations, verified tips, and authentic photos.</li>
          <li>💡 Keep suggestions constructive and travel-oriented.</li>
        </ul>
      </div>

      {/* 3. Trending Travel Tags Card */}
      <div className="sidebar-card tags-card">
        <div className="sidebar-card-header">
          <Heart size={18} className="sidebar-icon" />
          <h3>Popular Travel Topics</h3>
        </div>
        <div className="tags-cloud">
          <span className="sidebar-tag">#TokyoFoodTour</span>
          <span className="sidebar-tag">#ParisCafes</span>
          <span className="sidebar-tag">#BaliSunsets</span>
          <span className="sidebar-tag">#SoloTravelTips</span>
          <span className="sidebar-tag">#BudgetItinerary</span>
          <span className="sidebar-tag">#BackpackingAsia</span>
        </div>
      </div>
    </aside>
  );
}
