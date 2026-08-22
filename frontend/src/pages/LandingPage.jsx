import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroBanner } from '../components/landing/HeroBanner';
import { SearchControls } from '../components/landing/SearchControls';
import { RegionalSection } from '../components/landing/RegionalSection';
import { PreviousTripsSection } from '../components/landing/PreviousTripsSection';
import { ToastContainer } from '../components/Toast';
import { MapPin, Star, DollarSign, Sparkles, Plus } from 'lucide-react';
import { tripService } from '../services/tripService';

const STANDALONE_CITIES = [
  {
    id: 'city_tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'Neon-lit skyscrapers, historic temples, and culinary experiences.',
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
    description: 'The romantic capital of art, fashion, and iconic architecture.',
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
    description: 'Futuristic skyline, desert safaris, and golden beaches.',
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
    description: 'Bustling metropolis with Broadway and Central Park.',
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
    description: 'Tropical paradise of volcanic mountains and iconic rice paddies.',
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
    description: 'Ancient ruins, vibrant piazzas, and famous Italian dining.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 140.0,
    popularityScore: 4.75,
  },
];

export function LandingPage({ currentUser, onOpenAuth, onLogout }) {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch Database Trips if logged in
  useEffect(() => {
    const fetchUserTrips = async () => {
      if (currentUser) {
        setLoadingTrips(true);
        try {
          const data = await tripService.getTrips();
          setTrips(data);
        } catch (err) {
          console.error('Failed to load user trips:', err);
        } finally {
          setLoadingTrips(false);
        }
      } else {
        setTrips([]);
      }
    };

    fetchUserTrips();
  }, [currentUser]);

  // Direct Navigation Handler to Existing Route /trips/create
  const handlePlanTripClick = () => {
    if (currentUser) {
      navigate('/trips/create');
    } else {
      navigate('/login');
    }
  };

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
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* 1. Top Navbar */}
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuth={onOpenAuth || (() => navigate('/login'))}
        onLogout={onLogout}
        onPlanTrip={handlePlanTripClick}
      />

      <main className="landing-main-content">
        {/* 2. Hero Banner */}
        <HeroBanner onPlanTrip={handlePlanTripClick} />

        {/* 3. Search & Filter Bar */}
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

        {/* Filtered Search Results Grid if Active */}
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
                          onClick={handlePlanTripClick}
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

        {/* 4. Top Regional Selections */}
        <RegionalSection onSelectRegion={handleSelectRegion} />

        {/* 5. Previous Trips */}
        <PreviousTripsSection
          trips={trips}
          isLoading={loadingTrips}
          error={null}
          onRetry={() => {}}
          onPlanTrip={handlePlanTripClick}
          isLoggedIn={!!currentUser}
          onOpenAuth={onOpenAuth || (() => navigate('/login'))}
        />
      </main>

      {/* 6. Floating / Fixed "+ Plan a Trip" Button (Bottom Right) */}
      <div className="wireframe-plan-trip-floating">
        <button
          type="button"
          className="btn-floating-plan-cta"
          onClick={handlePlanTripClick}
        >
          <Plus size={20} />
          <span>Plan a trip</span>
        </button>
      </div>

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
