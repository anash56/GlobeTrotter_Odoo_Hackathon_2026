import React from 'react';
import { Compass, PlusCircle, Search, RefreshCw } from 'lucide-react';

export function EmptyCommunityState({ isSearchResult, onReset, onOpenCreateModal }) {
  if (isSearchResult) {
    return (
      <div className="community-empty-card">
        <div className="empty-icon-circle">
          <Search size={36} color="#6587D2" />
        </div>
        <h3>No matching travel posts found</h3>
        <p>Try adjusting your search query, filter options, or clearing your search.</p>
        <button type="button" className="btn-empty-action" onClick={onReset}>
          <RefreshCw size={16} /> Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="community-empty-card">
      <div className="empty-icon-circle">
        <Compass size={40} color="#6587D2" />
      </div>
      <h3>No travel stories yet</h3>
      <p>Be the first traveler to share an experience, trip itinerary, or tip with the GlobeTrotter community.</p>
      <button type="button" className="btn-empty-action primary" onClick={onOpenCreateModal}>
        <PlusCircle size={16} /> Create Your First Post
      </button>
    </div>
  );
}
