import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Globe, 
  Compass, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Plane,
  X
} from 'lucide-react';
import { tripService } from '../services/tripService';
import { TripListingCard, getTripStatus } from '../components/trips/TripListingCard';
import { useAuth } from '../context/AuthContext';

export function MyTripsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Data states
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ONGOING' | 'UPCOMING' | 'COMPLETED'
  const [destinationFilter, setDestinationFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'start-date-asc' | 'start-date-desc' | 'budget-asc' | 'budget-desc'

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tripService.getTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching user trips:', err);
      setError(err.message || 'Unable to load your trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Compute list of unique destinations available across all user trips
  const availableDestinations = useMemo(() => {
    const destSet = new Set();
    trips.forEach((trip) => {
      trip.stops?.forEach((stop) => {
        if (stop.city?.name) {
          destSet.add(stop.city.name);
        }
      });
    });
    return Array.from(destSet).sort();
  }, [trips]);

  // Derive counts for trip stats pill
  const tripStats = useMemo(() => {
    let ongoing = 0;
    let upcoming = 0;
    let completed = 0;

    trips.forEach((trip) => {
      const st = getTripStatus(trip.startDate, trip.endDate);
      if (st === 'ONGOING') ongoing++;
      else if (st === 'UPCOMING') upcoming++;
      else if (st === 'COMPLETED') completed++;
    });

    return {
      total: trips.length,
      ongoing,
      upcoming,
      completed,
    };
  }, [trips]);

  // Filter & Sort trips
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];

    // 1. Search Query Filter (Title, Destination city/country, Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((trip) => {
        const titleMatch = trip.title?.toLowerCase().includes(q);
        const descMatch = trip.description?.toLowerCase().includes(q);
        const destMatch = trip.stops?.some((s) =>
          s.city?.name?.toLowerCase().includes(q) ||
          s.city?.country?.toLowerCase().includes(q) ||
          s.city?.region?.toLowerCase().includes(q)
        );
        return titleMatch || descMatch || destMatch;
      });
    }

    // 2. Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter((trip) => {
        const st = getTripStatus(trip.startDate, trip.endDate);
        return st === statusFilter;
      });
    }

    // 3. Destination Filter
    if (destinationFilter !== 'ALL') {
      result = result.filter((trip) => {
        return trip.stops?.some(
          (s) => s.city?.name?.toLowerCase() === destinationFilter.toLowerCase()
        );
      });
    }

    // 4. Sort Ordering
    result.sort((a, b) => {
      const startA = new Date(a.startDate).getTime();
      const startB = new Date(b.startDate).getTime();
      const createdA = new Date(a.createdAt || a.startDate).getTime();
      const createdB = new Date(b.createdAt || b.startDate).getTime();
      const budgetA = Number(a.totalBudget) || 0;
      const budgetB = Number(b.totalBudget) || 0;

      switch (sortBy) {
        case 'newest':
          return createdB - createdA;
        case 'oldest':
          return createdA - createdB;
        case 'start-date-asc':
          return startA - startB;
        case 'start-date-desc':
          return startB - startA;
        case 'budget-asc':
          return budgetA - budgetB;
        case 'budget-desc':
          return budgetB - budgetA;
        default:
          return createdB - createdA;
      }
    });

    return result;
  }, [trips, searchQuery, statusFilter, destinationFilter, sortBy]);

  // Group filtered trips into Ongoing, Upcoming, Completed
  const groupedTrips = useMemo(() => {
    const ongoing = [];
    const upcoming = [];
    const completed = [];

    filteredAndSortedTrips.forEach((trip) => {
      const st = getTripStatus(trip.startDate, trip.endDate);
      if (st === 'ONGOING') {
        ongoing.push(trip);
      } else if (st === 'UPCOMING') {
        upcoming.push(trip);
      } else {
        completed.push(trip);
      }
    });

    return { ongoing, upcoming, completed };
  }, [filteredAndSortedTrips]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    destinationFilter !== 'ALL' ||
    sortBy !== 'newest';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDestinationFilter('ALL');
    setSortBy('newest');
  };

  return (
    <div className="my-trips-page-container">
      {/* Background ambient glowing shapes */}
      <div className="my-trips-orb orb-a" />
      <div className="my-trips-orb orb-b" />

      {/* 1. Page Hero Banner */}
      <section className="my-trips-hero">
        <div className="my-trips-hero-inner">
          <div className="hero-badge-capsule">
            <Sparkles size={14} /> Personal Travel Hub
          </div>

          <h1 className="my-trips-title">My Trips</h1>
          <p className="my-trips-subtitle">
            Manage your adventures, upcoming journeys, and travel memories.
          </p>

          {/* Quick stats pill */}
          {!loading && trips.length > 0 && (
            <div className="trips-stat-bar">
              <span className="stat-pill total">
                <strong>{tripStats.total}</strong> Total
              </span>
              <span className="stat-pill ongoing">
                <span className="dot dot-live" /> <strong>{tripStats.ongoing}</strong> Ongoing
              </span>
              <span className="stat-pill upcoming">
                <strong>{tripStats.upcoming}</strong> Upcoming
              </span>
              <span className="stat-pill completed">
                <strong>{tripStats.completed}</strong> Completed
              </span>
            </div>
          )}
        </div>

        {/* Primary CTA */}
        <div className="hero-cta-wrap">
          <Link to="/trips/create" className="btn-plan-trip-cta">
            <Plus size={18} />
            <span>Plan a New Trip</span>
          </Link>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="my-trips-content">
        {/* 2. Search + Filter + Sort Toolbar */}
        <section className="trips-filter-toolbar" aria-label="Trip Search and Filters">
          {/* Search Box */}
          <div className="toolbar-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              id="trip-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your trips..."
              className="toolbar-search-input"
              aria-label="Search your trips"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Controls Cluster */}
          <div className="toolbar-controls-cluster">
            {/* Status Filter Tabs / Dropdown */}
            <div className="filter-group">
              <label htmlFor="status-filter-select" className="filter-label">
                <Filter size={14} />
                <span>Status:</span>
              </label>
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="toolbar-select"
              >
                <option value="ALL">All Statuses ({trips.length})</option>
                <option value="ONGOING">Ongoing ({tripStats.ongoing})</option>
                <option value="UPCOMING">Upcoming ({tripStats.upcoming})</option>
                <option value="COMPLETED">Completed ({tripStats.completed})</option>
              </select>
            </div>

            {/* Destination Filter */}
            {availableDestinations.length > 0 && (
              <div className="filter-group">
                <label htmlFor="destination-filter-select" className="filter-label">
                  <MapPin size={14} />
                  <span>Destination:</span>
                </label>
                <select
                  id="destination-filter-select"
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="ALL">All Destinations</option>
                  {availableDestinations.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Control */}
            <div className="filter-group">
              <label htmlFor="sort-filter-select" className="filter-label">
                <SlidersHorizontal size={14} />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="toolbar-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="start-date-asc">Start Date (Soonest)</option>
                <option value="start-date-desc">Start Date (Latest)</option>
                <option value="budget-asc">Budget: Low to High</option>
                <option value="budget-desc">Budget: High to Low</option>
              </select>
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-reset-toolbar"
                onClick={handleResetFilters}
                title="Reset all search and filter conditions"
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>

        {/* 3. Render Views (Loading / Error / Global Empty / Trip Sections) */}
        {loading ? (
          /* Loading Skeleton Grid */
          <div className="trips-loading-view" aria-busy="true">
            <div className="skeleton-section-header" />
            <div className="trips-cards-grid">
              <div className="trip-card-skeleton" />
              <div className="trip-card-skeleton" />
              <div className="trip-card-skeleton" />
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="trips-error-container">
            <AlertCircle size={44} className="error-icon" />
            <h2>Unable to load your trips.</h2>
            <p>{error}</p>
            <button type="button" className="btn-retry-trips" onClick={fetchTrips}>
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        ) : trips.length === 0 ? (
          /* Global Empty State (User has zero trips created) */
          <div className="global-empty-trips-card">
            <div className="empty-globe-icon-wrap">
              <Globe size={54} className="empty-globe-icon" />
            </div>
            <h2>Your adventures start here.</h2>
            <p>
              Create your first trip and start building an unforgettable itinerary with customized stops, activities, and budget tracking.
            </p>
            <Link to="/trips/create" className="btn-empty-create-trip">
              <Plus size={18} />
              <span>Plan Your First Trip</span>
            </Link>
          </div>
        ) : filteredAndSortedTrips.length === 0 ? (
          /* Filter No-Match State */
          <div className="filter-no-results-card">
            <Search size={40} className="no-results-icon" />
            <h3>No trips matched your search or filters</h3>
            <p>Try adjusting your search keywords, clear destination filters, or view all trips.</p>
            <button type="button" className="btn-secondary-action" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Trip Sections: Ongoing, Upcoming, Completed */
          <div className="trips-sections-container">
            {/* 3A. ONGOING TRIPS SECTION */}
            {(statusFilter === 'ALL' || statusFilter === 'ONGOING') && (
              <section className="trip-category-section" id="ongoing-trips">
                <div className="category-header-row">
                  <div className="category-title-group">
                    <h2 className="category-title">
                      <span className="category-emoji">🚀</span> Ongoing Trips
                    </h2>
                    <span className="category-badge badge-ongoing">
                      {groupedTrips.ongoing.length} {groupedTrips.ongoing.length === 1 ? 'Trip' : 'Trips'} Active
                    </span>
                  </div>
                </div>

                {groupedTrips.ongoing.length > 0 ? (
                  <div className="trips-cards-grid">
                    {groupedTrips.ongoing.map((trip) => (
                      <TripListingCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                ) : (
                  <div className="section-empty-box">
                    <p className="empty-text">No trips are currently in progress.</p>
                  </div>
                )}
              </section>
            )}

            {/* 3B. UPCOMING TRIPS SECTION */}
            {(statusFilter === 'ALL' || statusFilter === 'UPCOMING') && (
              <section className="trip-category-section" id="upcoming-trips">
                <div className="category-header-row">
                  <div className="category-title-group">
                    <h2 className="category-title">
                      <span className="category-emoji">✈️</span> Upcoming Trips
                    </h2>
                    <span className="category-badge badge-upcoming">
                      {groupedTrips.upcoming.length} {groupedTrips.upcoming.length === 1 ? 'Trip' : 'Trips'} Planned
                    </span>
                  </div>
                </div>

                {groupedTrips.upcoming.length > 0 ? (
                  <div className="trips-cards-grid">
                    {groupedTrips.upcoming.map((trip) => (
                      <TripListingCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                ) : (
                  <div className="section-empty-box with-cta">
                    <p className="empty-text">Your next adventure is waiting.</p>
                    <Link to="/trips/create" className="btn-section-cta">
                      <Plus size={14} />
                      <span>Plan a Trip</span>
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* 3C. COMPLETED TRIPS SECTION */}
            {(statusFilter === 'ALL' || statusFilter === 'COMPLETED') && (
              <section className="trip-category-section" id="completed-trips">
                <div className="category-header-row">
                  <div className="category-title-group">
                    <h2 className="category-title">
                      <span className="category-emoji">✓</span> Completed Trips
                    </h2>
                    <span className="category-badge badge-completed">
                      {groupedTrips.completed.length} {groupedTrips.completed.length === 1 ? 'Trip' : 'Trips'} Past
                    </span>
                  </div>
                </div>

                {groupedTrips.completed.length > 0 ? (
                  <div className="trips-cards-grid">
                    {groupedTrips.completed.map((trip) => (
                      <TripListingCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                ) : (
                  <div className="section-empty-box with-cta">
                    <p className="empty-text">No completed trips yet.</p>
                    <Link to="/trips/create" className="btn-section-cta">
                      <Plus size={14} />
                      <span>Start Your First Trip</span>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
