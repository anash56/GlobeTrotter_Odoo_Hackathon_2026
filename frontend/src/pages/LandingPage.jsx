import React, { useState, useEffect } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroBanner } from '../components/landing/HeroBanner';
import { SearchControls } from '../components/landing/SearchControls';
import { RegionalSection } from '../components/landing/RegionalSection';
import { PreviousTripsSection } from '../components/landing/PreviousTripsSection';
import { PlanTripModal } from '../components/landing/PlanTripModal';
import { ToastContainer } from '../components/Toast';
import { cityService } from '../services/cityService';
import { tripService } from '../services/tripService';
import { MapPin, Star, DollarSign, Sparkles } from 'lucide-react';

export function LandingPage({ currentUser, onOpenAuth, onLogout }) {
  // Search, Group By, Filter, and Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Cities data state
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);

  // User Trips data state
  const [trips, setTrips] = useState([]);
  const [isTripsLoading, setIsTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState(null);

  // Modal & Toast state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch cities whenever search/filter/sort parameters change
  useEffect(() => {
    let isMounted = true;
    const fetchCitiesData = async () => {
      setIsCitiesLoading(true);
      try {
        const data = await cityService.getCities({
          search: searchQuery,
          region: groupBy,
          costIndex: costFilter,
          sortBy: sortBy,
        });
        if (isMounted) {
          setCities(data);
        }
      } catch (err) {
        console.error('Error loading cities:', err);
      } finally {
        if (isMounted) setIsCitiesLoading(false);
      }
    };

    fetchCitiesData();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, groupBy, costFilter, sortBy]);

  // Fetch authenticated user's trips whenever currentUser changes
  const loadUserTrips = async () => {
    if (!currentUser) {
      setTrips([]);
      return;
    }
    setIsTripsLoading(true);
    setTripsError(null);
    try {
      const userTrips = await tripService.getTrips();
      setTrips(userTrips);
    } catch (err) {
      setTripsError('Unable to load your trips. Please try again.');
    } finally {
      setIsTripsLoading(false);
    }
  };

  useEffect(() => {
    loadUserTrips();
  }, [currentUser]);

  // Handle creating a new trip
  const handleCreateTrip = async (tripData) => {
    setIsCreatingTrip(true);
    try {
      const newTrip = await tripService.createTrip(tripData);
      setTrips((prev) => [newTrip, ...prev]);
      addToast(`Trip "${newTrip.title}" created successfully!`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to create trip.', 'error');
    } finally {
      setIsCreatingTrip(false);
    }
  };

  // Select region from RegionalSection cards
  const handleSelectRegion = (regionName) => {
    setGroupBy(regionName);
    const searchElem = document.getElementById('search-section');
    if (searchElem) {
      searchElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setGroupBy('All');
    setCostFilter('All');
    setSortBy('default');
  };

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        onPlanTrip={() => setIsPlanModalOpen(true)}
      />

      <main className="landing-main-content">
        {/* Hero Section */}
        <HeroBanner onPlanTrip={() => setIsPlanModalOpen(true)} />

        {/* Search, Group By, Filter, and Sort Controls */}
        <SearchControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          costFilter={costFilter}
          onCostFilterChange={setCostFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Search & Discovery Results Display */}
        {(searchQuery || groupBy !== 'All' || costFilter !== 'All' || sortBy !== 'default') && (
          <section className="search-results-section">
            <div className="section-header">
              <div>
                <div className="section-subtitle">
                  <Sparkles size={14} /> Explorer Results
                </div>
                <h2 className="section-title">
                  {cities.length} {cities.length === 1 ? 'Destination' : 'Destinations'} Found
                </h2>
              </div>
            </div>

            {isCitiesLoading ? (
              <div className="trips-loading-skeleton">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : cities.length > 0 ? (
              <div className="cities-grid">
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
                      <p>{city.description}</p>
                      <div className="city-card-footer">
                        <span className="cost-tag">
                          <DollarSign size={13} /> {city.costIndex} (~${city.avgDailyCost}/day)
                        </span>
                        <button
                          type="button"
                          className="btn-add-to-trip"
                          onClick={() => {
                            setIsPlanModalOpen(true);
                          }}
                        >
                          + Plan Here
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-search-state">
                <MapPin size={32} color="#66736F" />
                <h3>No destinations match your search.</h3>
                <p>Try clearing filters or searching for another region or city name.</p>
                <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Top Regional Selections */}
        <RegionalSection onSelectRegion={handleSelectRegion} />

        {/* Previous Trips Section (Authenticated User Data) */}
        <PreviousTripsSection
          trips={trips}
          isLoading={isTripsLoading}
          error={tripsError}
          onRetry={loadUserTrips}
          onPlanTrip={() => setIsPlanModalOpen(true)}
          isLoggedIn={!!currentUser}
          onOpenAuth={onOpenAuth}
        />
      </main>

      {/* Plan a Trip Interactive Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSubmit={handleCreateTrip}
        isLoading={isCreatingTrip}
        isLoggedIn={!!currentUser}
        onOpenAuth={onOpenAuth}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
