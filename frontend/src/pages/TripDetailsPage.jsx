import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, DollarSign, Star, Compass, 
  Sparkles, Plus, Clock, Info, CheckCircle2, User 
} from 'lucide-react';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';

export function TripDetailsPage({ tripId: propTripId, onBack, currentUser: propUser }) {
  const { id: paramTripId } = useParams();
  const navigate = useNavigate();
  const { currentUser: authUser } = useAuth();
  const currentUser = propUser || authUser;
  const tripId = propTripId || paramTripId;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };


  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        const data = await tripService.getTripById(tripId);
        setTrip(data);
      } catch (err) {
        console.error('Fetch trip error:', err);
        setError(err.message || 'Failed to load trip details.');
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="trip-details-loading">
        <div className="spinner-navy" />
        <p>Loading your trip itinerary...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="trip-details-error">
        <Info size={32} />
        <h2>Trip Not Found</h2>
        <p>{error || 'The requested trip could not be loaded.'}</p>
        <button className="btn-secondary" onClick={handleBack}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    );
  }

  const primaryStop = trip.stops?.[0];
  const city = primaryStop?.city;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="trip-details-container">
      {/* Top Bar */}
      <header className="trip-details-header">
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={18} /> Back to Trips
        </button>
        <div className="brand-badge">
          <Compass size={22} className="brand-logo-icon" />
          <span className="brand-name">GlobeTrotter</span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="trip-hero-banner" style={{ backgroundImage: `url(${trip.coverPhotoUrl || city?.imageUrl})` }}>
        <div className="hero-gradient-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> Active Trip Itinerary
          </div>
          <h1 className="hero-title">{trip.title}</h1>
          <div className="hero-meta-row">
            <span className="meta-item"><MapPin size={16} /> {city?.name}, {city?.country}</span>
            <span className="meta-item"><Calendar size={16} /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
            <span className="meta-item badge-duration"><Clock size={16} /> {calculateDays()} Days</span>
          </div>
          <div style={{ marginTop: '1.2rem' }}>
            <button
              className="btn-primary"
              style={{ width: 'auto', display: 'inline-flex', padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
              onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
            >
              <Sparkles size={16} /> Build & Manage Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* Main Trip Body */}
      <main className="trip-details-main">
        <div className="trip-grid-layout">
          {/* Left Column: Itinerary Building Overview */}
          <div className="itinerary-column">
            <div className="card-section">
              <div className="section-title-row">
                <h2>Initial Destination Stop</h2>
                <span className="tag-primary">Step 1 Ready</span>
              </div>
              <p className="section-desc">
                Your trip foundation has been established for <strong>{city?.name}</strong>. You are ready to start building day-by-day activities and expenses.
              </p>

              {city && (
                <div className="destination-preview-card">
                  <img src={city.imageUrl} alt={city.name} className="dest-img" />
                  <div className="dest-details">
                    <h3>{city.name}, {city.country}</h3>
                    <p className="dest-region">{city.region} • Rating ⭐ {city.popularityScore}</p>
                    <p className="dest-desc">{city.description}</p>
                    <div className="dest-stats">
                      <span>Avg Daily Cost: <strong>${city.avgDailyCost}</strong></span>
                      <span>Cost Index: <strong>{city.costIndex}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Activities from Database */}
            {city?.activities && city.activities.length > 0 && (
              <div className="card-section" style={{ marginTop: '1.5rem' }}>
                <h3>Recommended Activities in {city.name}</h3>
                <div className="activities-list">
                  {city.activities.map((act) => (
                    <div key={act.id} className="activity-item-card">
                      <div className="act-info">
                        <h4>{act.name}</h4>
                        <p>{act.description}</p>
                        <div className="act-meta">
                          <span className="act-category">{act.category}</span>
                          <span>Est. Cost: ${act.estimatedCost}</span>
                          <span>Duration: {act.durationHours}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Trip Info & Budget Overview */}
          <div className="summary-sidebar">
            <div className="card-section sidebar-card">
              <h3>Trip Overview</h3>
              <ul className="info-list">
                <li>
                  <span className="label">Owner</span>
                  <span className="value">{trip.user?.name || currentUser?.name}</span>
                </li>
                <li>
                  <span className="label">Status</span>
                  <span className="value tag-success">Confirmed</span>
                </li>
                <li>
                  <span className="label">Total Budget</span>
                  <span className="value font-bold">${trip.totalBudget?.toFixed(0)}</span>
                </li>
                <li>
                  <span className="label">Share Code</span>
                  <span className="value code">{trip.shareToken?.substring(0, 8)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
