import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useAuth } from '../context/AuthContext';
import { cityService } from '../services/cityService';
import { activityService } from '../services/activityService';
import {
  Search,
  Filter,
  Compass,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
  ArrowUpDown,
  X,
  Plus,
  ArrowRight,
  Utensils,
  Camera,
  Sun,
  Palette,
  Bike
} from 'lucide-react';

export function ExplorePage() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState('all'); // 'all' | 'destinations' | 'activities'
  const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  // Data State
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Cities and Activities from Database APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cityParams = {
          q: searchQuery,
          region: regionFilter,
          costIndex: costFilter,
          sortBy: sortBy === 'popularity' ? 'popularity' : sortBy === 'cost-asc' ? 'cost-asc' : sortBy === 'cost-desc' ? 'cost-desc' : 'name',
        };

        const activityParams = {
          q: searchQuery,
          category: categoryFilter,
          sortBy: sortBy === 'cost-asc' ? 'cost-asc' : sortBy === 'cost-desc' ? 'cost-desc' : sortBy === 'duration-asc' ? 'duration-asc' : sortBy === 'duration-desc' ? 'duration-desc' : undefined,
        };

        const [cityData, activityData] = await Promise.all([
          cityService.getCities(cityParams),
          activityService.getActivities(activityParams),
        ]);

        setCities(cityData || []);
        setActivities(activityData || []);
      } catch (err) {
        console.error('Failed to load explore data:', err);
        setError('Failed to fetch search results from the database. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300); // 300ms search debounce
    return () => clearTimeout(timer);
  }, [searchQuery, regionFilter, categoryFilter, costFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchType('all');
    setRegionFilter('All');
    setCategoryFilter('All');
    setCostFilter('All');
    setSortBy('popularity');
    setSearchParams({});
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return <Utensils size={13} />;
      case 'sightseeing':
        return <Camera size={13} />;
      case 'adventure':
        return <Bike size={13} />;
      case 'culture':
        return <Palette size={13} />;
      case 'relaxation':
        return <Sun size={13} />;
      default:
        return <Sparkles size={13} />;
    }
  };

  const totalResultsCount =
    searchType === 'destinations'
      ? cities.length
      : searchType === 'activities'
      ? activities.length
      : cities.length + activities.length;

  const hasActiveFilters = searchQuery || searchType !== 'all' || regionFilter !== 'All' || categoryFilter !== 'All' || costFilter !== 'All' || sortBy !== 'popularity';

  return (
    <div className="explore-page">
      {/* 1. Navbar */}
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuth={() => navigate('/login')}
        onLogout={logoutUser}
        onPlanTrip={() => navigate(currentUser ? '/trips/create' : '/login')}
      />

      <main className="explore-main-content">
        {/* 2. Hero Section */}
        <section className="explore-hero-section">
          <div className="explore-hero-card">
            <div className="hero-badge">
              <Compass size={14} /> EXPLORE THE WORLD
            </div>
            <h1 className="hero-title">Find Your Next Destination</h1>
            <p className="hero-subtitle">
              Discover iconic cities, local food tours, outdoor adventures, and cultural experiences worldwide.
            </p>

            {/* Prominent Search Bar */}
            <div className="explore-search-input-wrapper">
              <Search size={22} className="search-icon" />
              <input
                type="text"
                className="explore-search-input"
                placeholder="Search cities, countries, destinations or activities (e.g. Paris, Tokyo, Food, Temple)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3. Search Type Switcher Tabs & Filters Toolbar */}
        <section className="explore-toolbar-section">
          <div className="explore-toolbar-card">
            {/* Search Type Tabs */}
            <div className="explore-type-tabs">
              <button
                type="button"
                className={`type-tab ${searchType === 'all' ? 'active' : ''}`}
                onClick={() => setSearchType('all')}
              >
                All Results ({cities.length + activities.length})
              </button>
              <button
                type="button"
                className={`type-tab ${searchType === 'destinations' ? 'active' : ''}`}
                onClick={() => setSearchType('destinations')}
              >
                Destinations ({cities.length})
              </button>
              <button
                type="button"
                className={`type-tab ${searchType === 'activities' ? 'active' : ''}`}
                onClick={() => setSearchType('activities')}
              >
                Activities ({activities.length})
              </button>
            </div>

            {/* Dropdown Filters & Sort Controls */}
            <div className="explore-filters-row">
              {/* Region Filter (Destinations) */}
              {(searchType === 'all' || searchType === 'destinations') && (
                <div className="filter-select-wrapper">
                  <label><Layers size={13} /> Region</label>
                  <select
                    className="toolbar-select"
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                  >
                    <option value="All">All Regions</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Middle East">Middle East</option>
                    <option value="North America">North America</option>
                    <option value="South Asia">South Asia</option>
                  </select>
                </div>
              )}

              {/* Category Filter (Activities) */}
              {(searchType === 'all' || searchType === 'activities') && (
                <div className="filter-select-wrapper">
                  <label><Sparkles size={13} /> Category</label>
                  <select
                    className="toolbar-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture & History</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>
              )}

              {/* Budget Filter */}
              <div className="filter-select-wrapper">
                <label><Filter size={13} /> Budget</label>
                <select
                  className="toolbar-select"
                  value={costFilter}
                  onChange={(e) => setCostFilter(e.target.value)}
                >
                  <option value="All">All Budgets</option>
                  <option value="Budget">Budget ($)</option>
                  <option value="Moderate">Moderate ($$)</option>
                  <option value="Luxury">Luxury ($$$)</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="filter-select-wrapper">
                <label><ArrowUpDown size={13} /> Sort By</label>
                <select
                  className="toolbar-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Most Popular</option>
                  <option value="cost-asc">Lowest Cost</option>
                  <option value="cost-desc">Highest Cost</option>
                  <option value="duration-asc">Shortest Duration</option>
                  <option value="duration-desc">Longest Duration</option>
                </select>
              </div>

              {/* Reset CTA */}
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-reset-explore"
                  onClick={handleResetFilters}
                >
                  <X size={14} /> Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 4. Results Section Header */}
        <section className="explore-results-header">
          <div className="results-header-info">
            <h2>
              {isLoading
                ? 'Searching database...'
                : `${totalResultsCount} ${totalResultsCount === 1 ? 'Result' : 'Results'} Found`}
            </h2>
            <p>
              {searchQuery
                ? `Showing results matching "${searchQuery}"`
                : 'Browse popular global destinations and curated experiences.'}
            </p>
          </div>
        </section>

        {/* 5. Results Content */}
        {isLoading ? (
          <div className="explore-skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="skeleton-card" />
            ))}
          </div>
        ) : error ? (
          <div className="explore-error-card">
            <MapPin size={36} color="#EF4444" />
            <h3>Unable to load search results</h3>
            <p>{error}</p>
            <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
              Try Again
            </button>
          </div>
        ) : totalResultsCount === 0 ? (
          <div className="explore-empty-card">
            <Compass size={44} color="#6587D2" />
            <h3>No matching destinations or activities found</h3>
            <p>Try searching for a different city, country name, or activity category.</p>
            <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
              Clear Search & Reset Filters
            </button>
          </div>
        ) : (
          <div className="explore-results-container">
            {/* DESTINATIONS SECTION */}
            {(searchType === 'all' || searchType === 'destinations') && cities.length > 0 && (
              <div className="results-category-block">
                <div className="block-title-row">
                  <h3>
                    <MapPin size={18} /> Destination Cities ({cities.length})
                  </h3>
                </div>

                <div className="explore-grid-5">
                  {cities.map((city) => (
                    <div key={city.id} className="city-result-card">
                      <div className="city-image-container">
                        <img src={city.imageUrl} alt={city.name} />
                        <span className="city-region-tag">{city.region}</span>
                      </div>

                      <div className="city-card-details">
                        <div className="city-card-header">
                          <h3>{city.name}, {city.country}</h3>
                          <span className="rating-badge">
                            <Star size={12} fill="#F4B942" color="#F4B942" /> {city.popularityScore}
                          </span>
                        </div>

                        <p className="city-card-desc">{city.description}</p>

                        <div className="city-card-footer">
                          <span className="cost-tag">
                            <DollarSign size={13} /> {city.costIndex} (~${city.avgDailyCost}/day)
                          </span>
                          <button
                            type="button"
                            className="btn-add-to-trip"
                            onClick={() => navigate(`/destinations/${city.id}`)}
                          >
                            Explore <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVITIES SECTION */}
            {(searchType === 'all' || searchType === 'activities') && activities.length > 0 && (
              <div className="results-category-block">
                <div className="block-title-row">
                  <h3>
                    <Sparkles size={18} /> Available Activities ({activities.length})
                  </h3>
                </div>

                <div className="explore-grid-5">
                  {activities.map((act) => (
                    <div key={act.id} className="activity-result-card">
                      <div className="activity-image-container">
                        <img
                          src={act.imageUrl || act.city?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                          alt={act.name}
                        />
                        <span className="activity-category-tag">
                          {getCategoryIcon(act.category)} {act.category}
                        </span>
                      </div>

                      <div className="activity-card-details">
                        <div className="activity-card-header">
                          <h3>{act.name}</h3>
                          <span className="city-location-badge">
                            <MapPin size={11} /> {act.city?.name || 'Destination'}
                          </span>
                        </div>

                        <p className="activity-card-desc">{act.description}</p>

                        <div className="activity-card-meta-row">
                          <span className="meta-badge">
                            <Clock size={12} /> {act.durationHours} hrs
                          </span>
                          <span className="meta-badge budget">
                            <DollarSign size={12} /> ${act.estimatedCost} est.
                          </span>
                        </div>

                        <div className="activity-card-footer">
                          <button
                            type="button"
                            className="btn-view-activity"
                            onClick={() => navigate(act.cityId ? `/destinations/${act.cityId}` : '/explore')}
                          >
                            View Activity <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating "+ Plan a Trip" Action Button */}
      <div className="wireframe-plan-trip-floating">
        <button
          type="button"
          className="btn-floating-plan-cta"
          onClick={() => navigate(currentUser ? '/trips/create' : '/login')}
        >
          <Plus size={20} />
          <span>Plan a trip</span>
        </button>
      </div>
    </div>
  );
}
