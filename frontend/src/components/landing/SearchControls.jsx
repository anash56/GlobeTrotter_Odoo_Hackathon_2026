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
      <div className="search-controls-toolbar">
        {/* Prominent Search Field (Wireframe: Search bar ......) */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
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
              <X size={14} />
            </button>
          )}
        </div>

        {/* Inline Filter Buttons (Wireframe: Group by | Filter | Sort by...) */}
        <div className="toolbar-buttons-row">
          <div className="control-select-wrapper">
            <select
              className="toolbar-select"
              value={groupBy}
              onChange={(e) => onGroupByChange(e.target.value)}
            >
              <option value="All">Group by</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Middle East">Middle East</option>
              <option value="North America">North America</option>
              <option value="South Asia">South Asia</option>
            </select>
          </div>

          <div className="control-select-wrapper">
            <select
              className="toolbar-select"
              value={costFilter}
              onChange={(e) => onCostFilterChange(e.target.value)}
            >
              <option value="All">Filter</option>
              <option value="Budget">Budget ($)</option>
              <option value="Moderate">Moderate ($$)</option>
              <option value="Luxury">Luxury ($$$)</option>
            </select>
          </div>

          <div className="control-select-wrapper">
            <select
              className="toolbar-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <option value="default">Sort by...</option>
              <option value="popularity">Most Popular</option>
              <option value="cost-asc">Lowest Cost</option>
              <option value="cost-desc">Highest Cost</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-reset-toolbar"
              onClick={onResetFilters}
              title="Reset Filters"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
