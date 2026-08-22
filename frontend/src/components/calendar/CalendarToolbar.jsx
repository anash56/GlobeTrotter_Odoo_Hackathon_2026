import React from 'react';
import { Search, Filter, Layers, SlidersHorizontal, RefreshCw, X } from 'lucide-react';

export function CalendarToolbar({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  onReset,
  hasActiveFilters,
  totalTripsCount,
  filteredCount
}) {
  return (
    <section className="calendar-toolbar" aria-label="Calendar search and filters">
      {/* 1. Live Search */}
      <div className="calendar-search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search trips, destinations, activities..."
          className="calendar-search-input"
          aria-label="Search trips and events"
        />
        {searchQuery && (
          <button
            type="button"
            className="btn-clear-search"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* 2. Controls Cluster */}
      <div className="calendar-controls-cluster">
        {/* Group By Filter */}
        <div className="toolbar-group">
          <label htmlFor="calendar-groupby-select" className="toolbar-label">
            <Layers size={14} />
            <span>Group:</span>
          </label>
          <select
            id="calendar-groupby-select"
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value)}
            className="calendar-select"
          >
            <option value="ALL">All Events</option>
            <option value="TRIP">By Trip</option>
            <option value="DESTINATION">By Destination</option>
            <option value="ACTIVITY">By Activity</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="toolbar-group">
          <label htmlFor="calendar-status-select" className="toolbar-label">
            <Filter size={14} />
            <span>Status:</span>
          </label>
          <select
            id="calendar-status-select"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="calendar-select"
          >
            <option value="ALL">All Statuses ({totalTripsCount})</option>
            <option value="ONGOING">Ongoing</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Sort Control */}
        <div className="toolbar-group">
          <label htmlFor="calendar-sort-select" className="toolbar-label">
            <SlidersHorizontal size={14} />
            <span>Sort by:</span>
          </label>
          <select
            id="calendar-sort-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="calendar-select"
          >
            <option value="date-asc">Date (Earliest First)</option>
            <option value="date-desc">Date (Latest First)</option>
            <option value="title">Trip Name (A-Z)</option>
            <option value="recently-updated">Recently Updated</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn-calendar-reset"
            onClick={onReset}
            title="Reset all search and filters"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </section>
  );
}
