import React from 'react';
import { Search, Filter, Layers, ArrowUpDown, X } from 'lucide-react';

export function SearchControls({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  costFilter,
  onCostFilterChange,
  sortBy,
  onSortByChange,
  onResetFilters,
}) {
  const hasActiveFilters = searchQuery || groupBy !== 'All' || costFilter !== 'All' || sortBy !== 'default';

  return (
    <div className="search-controls-container" id="search-section">
      <div className="search-controls-card">
        {/* Prominent Search Field (Wireframe: Search bar ......) */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search bar ......"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls Grid (Wireframe: Group by | Filter | Sort by...) */}
        <div className="controls-grid">
          {/* Group By Select */}
          <div className="control-group">
            <label className="control-label">
              <Layers size={14} /> Group by
            </label>
            <select
              className="control-select"
              value={groupBy}
              onChange={(e) => onGroupByChange(e.target.value)}
            >
              <option value="All">All Regions</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Middle East">Middle East</option>
              <option value="North America">North America</option>
              <option value="South Asia">South Asia</option>
            </select>
          </div>

          {/* Filter By Cost */}
          <div className="control-group">
            <label className="control-label">
              <Filter size={14} /> Filter
            </label>
            <select
              className="control-select"
              value={costFilter}
              onChange={(e) => onCostFilterChange(e.target.value)}
            >
              <option value="All">All Budgets</option>
              <option value="Budget">Budget ($)</option>
              <option value="Moderate">Moderate ($$)</option>
              <option value="Luxury">Luxury ($$$)</option>
            </select>
          </div>

          {/* Sort By Select */}
          <div className="control-group">
            <label className="control-label">
              <ArrowUpDown size={14} /> Sort by...
            </label>
            <select
              className="control-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="popularity">Most Popular</option>
              <option value="cost-asc">Lowest Cost</option>
              <option value="cost-desc">Highest Cost</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={onResetFilters}
            >
              <X size={14} /> Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
