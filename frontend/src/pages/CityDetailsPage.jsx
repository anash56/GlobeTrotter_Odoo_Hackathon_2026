import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { useAuth } from '../context/AuthContext';
import { cityService } from '../services/cityService';
import {
  MapPin,
  Star,
  DollarSign,
  ArrowLeft,
  Plus,
  Sparkles,
  Clock,
  Camera,
  Utensils,
  Sun,
  Palette,
  Bike
} from 'lucide-react';

export function CityDetailsPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();

  const [city, setCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await cityService.getCityById(cityId);
        setCity(data);
      } catch (err) {
        console.error('Error loading city details:', err);
        setError('City details could not be found.');
      } finally {
        setIsLoading(false);
      }
    };

    if (cityId) {
      fetchCityDetails();
    }
  }, [cityId]);

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

  if (isLoading) {
    return (
      <div className="city-details-container">
        <LandingNavbar currentUser={currentUser} onOpenAuth={() => navigate('/login')} onLogout={logoutUser} />
        <div className="loading-grid-state" style={{ minHeight: '60vh' }}>
          <div className="spinner-navy" />
          <p>Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="city-details-container">
        <LandingNavbar currentUser={currentUser} onOpenAuth={() => navigate('/login')} onLogout={logoutUser} />
        <div className="empty-trips-card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
          <MapPin size={48} className="empty-icon" />
          <h3>Destination Not Found</h3>
          <p>{error || 'The requested destination details could not be loaded.'}</p>
          <Link to="/explore" className="btn-secondary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="city-details-container">
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuth={() => navigate('/login')}
        onLogout={logoutUser}
        onPlanTrip={() => navigate(currentUser ? '/trips/create' : '/login')}
      />

      {/* Hero Banner with Destination Cover */}
      <div
        className="trip-hero-banner"
        style={{
          backgroundImage: `url(${city.imageUrl})`,
        }}
      >
        <div className="hero-gradient-overlay" />
        <div className="hero-content">
          <Link to="/explore" className="btn-back" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <ArrowLeft size={14} /> Back to Search
          </Link>

          <div className="hero-badge">
            <MapPin size={14} /> {city.region} Region
          </div>

          <h1 className="hero-title">
            {city.name}, {city.country}
          </h1>

          <div className="hero-meta-row">
            <div className="meta-item">
              <Star size={16} fill="#F4B942" color="#F4B942" />
              <span>{city.popularityScore} Popularity Rating</span>
            </div>

            <div className="meta-item">
              <DollarSign size={16} />
              <span>{city.costIndex} (~${city.avgDailyCost}/day)</span>
            </div>

            <button
              type="button"
              className="btn-primary-hero"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', marginLeft: 'auto' }}
              onClick={() => navigate(currentUser ? '/trips/create' : '/login')}
            >
              <Plus size={16} /> Plan a Trip to {city.name}
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <main className="trip-details-main">
        <div className="trip-grid-layout">
          {/* Main Info Column */}
          <div className="main-info-col">
            {/* Overview Section */}
            <div className="card-section">
              <div className="section-title-row">
                <h2>About {city.name}</h2>
                <span className="tag-primary">{city.country}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem' }}>
                {city.description}
              </p>
            </div>

            {/* Activities List Section */}
            <div className="card-section" style={{ marginTop: '2rem' }}>
              <div className="section-title-row">
                <h2>Things to Do in {city.name} ({city.activities?.length || 0})</h2>
              </div>

              {city.activities && city.activities.length > 0 ? (
                <div className="activities-list" style={{ marginTop: '1.2rem' }}>
                  {city.activities.map((act) => (
                    <div key={act.id} className="activity-item-card">
                      <div className="activity-main-details">
                        <div className="activity-header-row">
                          <span className="activity-category-tag">
                            {getCategoryIcon(act.category)} {act.category}
                          </span>
                          <span className="activity-time-tag">
                            <Clock size={12} /> {act.durationHours} Hours
                          </span>
                        </div>
                        <h4 className="activity-title" style={{ marginTop: '0.3rem' }}>{act.name}</h4>
                        <p className="activity-desc">{act.description}</p>
                        <div className="activity-footer-row" style={{ marginTop: '0.4rem' }}>
                          <span className="activity-cost">
                            <DollarSign size={13} /> Estimated Cost: ${act.estimatedCost}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  No specific activity itineraries added yet for this city.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar Stats Column */}
          <div className="sidebar-col">
            <div className="card-section sidebar-card">
              <h3>Destination Summary</h3>
              <ul className="info-list">
                <li>
                  <span className="label">Destination City</span>
                  <span className="value">{city.name}</span>
                </li>
                <li>
                  <span className="label">Country</span>
                  <span className="value">{city.country}</span>
                </li>
                <li>
                  <span className="label">World Region</span>
                  <span className="value">{city.region}</span>
                </li>
                <li>
                  <span className="label">Cost Profile</span>
                  <span className="value">{city.costIndex}</span>
                </li>
                <li>
                  <span className="label">Average Daily Cost</span>
                  <span className="value tag-success">${city.avgDailyCost}/day</span>
                </li>
                <li>
                  <span className="label">Activities Count</span>
                  <span className="value">{city.activities?.length || 0} Listed</span>
                </li>
              </ul>

              <button
                type="button"
                className="btn-create-submit"
                style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
                onClick={() => navigate(currentUser ? '/trips/create' : '/login')}
              >
                <Plus size={18} /> Add {city.name} to Trip
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
