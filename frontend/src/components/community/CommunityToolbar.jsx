import React from 'react';
import { Search, Filter, Layers, ArrowUpDown, X, Sparkles } from 'lucide-react';

export function CommunityToolbar({
  searchQuery,
  setSearchQuery,
  groupBy,
  setGroupBy,
  filterOption,
  setFilterOption,
  sortBy,
  setSortBy,
  onResetFilters,
  hasActiveFilters,
  currentUser,
}) {
  return (
    <div className="community-toolbar-container">
      {/* 1. Search Bar */}
      <div className="community-search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="community-search-input"
          placeholder="Search by keyword, destination, tip, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* 2. Responsive Controls Row */}
      <div className="community-controls-grid">
        {/* Group By */}
        <div className="control-select-wrapper">
          <label>
            <Layers size={13} /> Group By
          </label>
          <select
            className="toolbar-select"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="all">All Feed</option>
            <option value="recent">Recent</option>
            <option value="destination">By Destination</option>
            <option value="category">By Experience Type</option>
          </select>
        </div>

        {/* Filter Option */}
        <div className="control-select-wrapper">
          <label>
            <Filter size={13} /> Filter
          </label>
          <select
            className="toolbar-select"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All Posts</option>
            {currentUser && <option value="my-posts">My Posts</option>}
            <option value="Trip Story">Trip Stories</option>
            <option value="Travel Tip">Travel Tips</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Destination Review">Destination Reviews</option>
            <option value="Recommendation">Recommendations</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="control-select-wrapper">
          <label>
            <ArrowUpDown size={13} /> Sort By
          </label>
          <select
            className="toolbar-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular (Likes)</option>
          </select>
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn-reset-toolbar"
            onClick={onResetFilters}
          >
            <X size={14} /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
