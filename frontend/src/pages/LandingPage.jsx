import React, { useState } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroBanner } from '../components/landing/HeroBanner';
import { SearchControls } from '../components/landing/SearchControls';
import { RegionalSection } from '../components/landing/RegionalSection';
import { PreviousTripsSection } from '../components/landing/PreviousTripsSection';
import { PlanTripModal } from '../components/landing/PlanTripModal';
import { ToastContainer } from '../components/Toast';
import { MapPin, Star, DollarSign, Sparkles, Plus } from 'lucide-react';

// Static seed destinations for standalone frontend presentation
const STANDALONE_CITIES = [
  {
    id: 'city_tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'Neon-lit skyscrapers, historic temples, and world-class culinary experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 150.0,
    popularityScore: 4.9,
  },
  {
    id: 'city_paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    description: 'The romantic capital of art, fashion, gastronomy, and iconic architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Luxury',
    avgDailyCost: 220.0,
    popularityScore: 4.8,
  },
  {
    id: 'city_dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    description: 'Futuristic skyline, desert safaris, luxury shopping, and golden beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Luxury',
    avgDailyCost: 250.0,
    popularityScore: 4.7,
  },
  {
    id: 'city_newyork',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    description: 'Bustling metropolis with Broadway, Central Park, and endless culture.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Luxury',
    avgDailyCost: 210.0,
    popularityScore: 4.9,
  },
  {
    id: 'city_bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'South Asia',
    description: 'Tropical paradise of volcanic mountains, iconic rice paddies, and coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Budget',
    avgDailyCost: 75.0,
    popularityScore: 4.85,
  },
  {
    id: 'city_rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    description: 'Ancient ruins, vibrant piazzas, rich history, and famous Italian dining.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 140.0,
    popularityScore: 4.75,
  },
];

// Initial mock user trips for rich frontend preview
const INITIAL_PREVIEW_TRIPS = [
  {
    id: 'trip_1',
    title: 'Autumn in Japan',
    description: 'Exploring Tokyo, Kyoto temples, and Mount Fuji vistas.',
    startDate: '2026-10-10',
    endDate: '2026-10-20',
    totalBudget: 2400,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    stops: [{ id: 's1' }, { id: 's2' }],
  },
  {
    id: 'trip_2',
    title: 'European Riviera Getaway',
    description: 'Coastal drives through Southern France and Italian coastlines.',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    totalBudget: 3200,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    stops: [{ id: 's3' }, { id: 's4' }, { id: 's5' }],
  },
];

export function LandingPage({ currentUser, onOpenAuth, onLogout }) {
  // Search, Group By, Filter, and Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // User Trips client state
  const [trips, setTrips] = useState(INITIAL_PREVIEW_TRIPS);

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

  // Pure frontend search, filter, and sort calculations
  const getFilteredCities = () => {
    let result = [...STANDALONE_CITIES];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (groupBy && groupBy !== 'All') {
      result = result.filter((c) => c.region.toLowerCase() === groupBy.toLowerCase());
    }

    if (costFilter && costFilter !== 'All') {
      result = result.filter((c) => c.costIndex.toLowerCase() === costFilter.toLowerCase());
    }

    if (sortBy === 'popularity') {
      result.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (sortBy === 'cost-asc') {
      result.sort((a, b) => a.avgDailyCost - b.avgDailyCost);
    } else if (sortBy === 'cost-desc') {
      result.sort((a, b) => b.avgDailyCost - a.avgDailyCost);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  };

  const filteredCities = getFilteredCities();
  const hasActiveSearchOrFilter = searchQuery || groupBy !== 'All' || costFilter !== 'All' || sortBy !== 'default';

  // Handle client-side trip creation
  const handleCreateTrip = async (tripData) => {
    setIsCreatingTrip(true);
    setTimeout(() => {
      const newTrip = {
        id: 'trip_' + Date.now(),
        title: tripData.title,
        description: tripData.description || 'Custom personal itinerary',
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        totalBudget: tripData.totalBudget ? parseFloat(tripData.totalBudget) : 1500,
        coverPhotoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
        stops: [{ id: 's_new' }],
      };
      setTrips((prev) => [newTrip, ...prev]);
      setIsCreatingTrip(false);
      addToast(`Trip "${newTrip.title}" created successfully!`, 'success');
    }, 400);
  };

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
      {/* Ambient Orbs matching Login/Signup design */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* Top Header/Navbar matching Wireframe (GlobeTrotter Logo left, User icon right) */}
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        onPlanTrip={() => setIsPlanModalOpen(true)}
      />

      <main className="landing-main-content">
        {/* Banner Image Hero Section (Wireframe Banner Image Box) */}
        <HeroBanner onPlanTrip={() => setIsPlanModalOpen(true)} />

        {/* Search bar, Group by, Filter, Sort by Controls (Screen 3 Wireframe) */}
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

        {/* Search & Filter Results Grid */}
        {hasActiveSearchOrFilter && (
          <section className="search-results-section">
            <div className="section-header">
              <div>
                <div className="section-subtitle">
                  <Sparkles size={14} /> Discovery Results
                </div>
                <h2 className="section-title">
                  {filteredCities.length} {filteredCities.length === 1 ? 'Destination' : 'Destinations'} Found
                </h2>
              </div>
            </div>

            {filteredCities.length > 0 ? (
              <div className="cities-grid">
                {filteredCities.map((city) => (
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
                          onClick={() => setIsPlanModalOpen(true)}
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
                <MapPin size={32} color="#6587D2" />
                <h3>No destinations match your search.</h3>
                <p>Try resetting filters or searching for another region or city name.</p>
                <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Top Regional Selections (Screen 3 Wireframe Row) */}
        <RegionalSection onSelectRegion={handleSelectRegion} />

        {/* Previous Trips Section (Screen 3 Wireframe Row) */}
        <PreviousTripsSection
          trips={trips}
          isLoading={false}
          error={null}
          onRetry={() => {}}
          onPlanTrip={() => setIsPlanModalOpen(true)}
          isLoggedIn={true}
          onOpenAuth={onOpenAuth}
        />
      </main>

      {/* Screen 3 Wireframe Bottom-Right Floating "+ Plan a trip" CTA */}
      <div className="wireframe-plan-trip-floating">
        <button
          type="button"
          className="btn-floating-plan-cta"
          onClick={() => setIsPlanModalOpen(true)}
        >
          <Plus size={20} />
          <span>Plan a trip</span>
        </button>
      </div>

      {/* Plan a Trip Interactive Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSubmit={handleCreateTrip}
        isLoading={isCreatingTrip}
        isLoggedIn={true}
        onOpenAuth={onOpenAuth}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
