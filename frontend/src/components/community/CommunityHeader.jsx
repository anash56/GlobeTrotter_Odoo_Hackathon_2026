import React from 'react';
import { Users, PlusCircle, Sparkles } from 'lucide-react';

export function CommunityHeader({ onOpenCreateModal, currentUser }) {
  return (
    <div className="community-header-banner">
      <div className="community-header-content">
        <div className="header-badge">
          <Users size={14} />
          <span>GLOBETROTTER TRAVEL COMMUNITY</span>
        </div>
        <h1 className="community-title">Community Feed</h1>
        <p className="community-subtitle">
          Share your travel experiences, discover inspiration, and connect with fellow travelers around the globe.
        </p>

        <div className="header-actions-row">
          <button
            type="button"
            className="btn-create-post-header"
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={18} />
            <span>Share Your Experience</span>
          </button>
          
          <div className="community-quick-stats">
            <span className="stat-item">
              <Sparkles size={14} color="#6587D2" /> Real Stories & Tips
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
