import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Calendar, Compass, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle2, Star, DollarSign, AlertCircle, Info 
} from 'lucide-react';
import { cityService } from '../services/cityService';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';

export function CreateTripPage({ currentUser: propUser, onTripCreated, onCancel }) {
  const navigate = useNavigate();
  const { currentUser: authUser } = useAuth();
  const currentUser = propUser || authUser;

  // Cities Data
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCities, setLoadingCities] = useState(true);
  
  // Selected Destination
  const [selectedCity, setSelectedCity] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
  });

  // UI State
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Fetch Cities on Mount
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingCities(true);
      try {
        const data = await cityService.getCities(searchQuery, true);
        setCities(data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchDestinations();
  }, [searchQuery]);

  // Handle Destination Select
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    // Auto populate default title if empty
    if (!formData.title || formData.title.startsWith('Trip to ')) {
      setFormData((prev) => ({
        ...prev,
        title: `Trip to ${city.name}`,
      }));
    }
    if (errors.cityId) {
      setErrors((prev) => ({ ...prev, cityId: '' }));
    }
  };

  // Calculate Duration
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return null;

    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const nights = Math.max(0, days - 1);
    return `${days} Days ${nights > 0 ? `/ ${nights} Nights` : ''}`;
  };

  const tripDuration = calculateDuration();

  // Validate Form
  const validate = () => {
    const newErrors = {};

    if (!selectedCity) {
      newErrors.cityId = 'Please select a destination city for your trip.';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Trip title is required.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        cityId: selectedCity.id,
        ...(formData.totalBudget ? { totalBudget: parseFloat(formData.totalBudget) } : {}),
      };

      const result = await tripService.createTrip(payload);
      
      if (onTripCreated && result.trip) {
        onTripCreated(result.trip);
      } else if (result.trip) {
        navigate(`/trips/${result.trip.id}`);
      }
    } catch (err) {
      console.error('Trip creation failed:', err);
      setApiError(err.message || 'Failed to create trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAction = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="create-trip-container">
      {/* Top Navbar */}
      <header className="create-trip-header">
        <div className="header-left">
          <button type="button" className="btn-back" onClick={handleCancelAction}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="brand-badge">
            <Compass size={22} className="brand-logo-icon" />
            <span className="brand-name">GlobeTrotter</span>
          </div>
        </div>
        <div className="user-profile-badge">
          <img 
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
            alt={currentUser?.name} 
            className="user-avatar"
          />
          <span>{currentUser?.name}</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="create-trip-main">
        <div className="create-trip-intro">
          <div className="badge-tag">
            <Sparkles size={14} /> Plan Your Next Journey
          </div>
          <h1>Create a New Trip</h1>
          <p>Select your destination, set travel dates, and start building your custom itinerary.</p>
        </div>

        {apiError && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-trip-form">
          {/* STEP 1: Select Destination */}
          <section className="form-section">
            <div className="section-header">
              <div className="step-number">1</div>
              <div>
                <h2>Choose Your Destination</h2>
                <p>Select a city from our curated global database</p>
              </div>
            </div>

            {/* City Search Input */}
            <div className="city-search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by city, country, or region (e.g. Paris, Japan, Europe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="city-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>

            {errors.cityId && (
              <div className="field-error-box">
                <AlertCircle size={14} /> {errors.cityId}
              </div>
            )}

            {/* City Cards Grid */}
            <div className="cities-grid">
              {loadingCities ? (
                <div className="loading-grid-state">
                  <div className="spinner-navy" />
                  <p>Loading destination cities...</p>
                </div>
              ) : cities.length === 0 ? (
                <div className="empty-cities-state">
                  <MapPin size={32} />
                  <p>No cities found matching "{searchQuery}". Try searching for another destination.</p>
                </div>
              ) : (
                cities.map((city) => {
                  const isSelected = selectedCity?.id === city.id;
                  return (
                    <div
                      key={city.id}
                      className={`city-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectCity(city)}
                    >
                      <div className="city-img-wrapper">
                        <img src={city.imageUrl} alt={city.name} className="city-img" />
                        <div className="city-overlay" />
                        <span className="city-region-badge">{city.region}</span>
                        {isSelected && (
                          <div className="selected-check-badge">
                            <CheckCircle2 size={20} />
                          </div>
                        )}
                      </div>
                      <div className="city-card-body">
                        <div className="city-title-row">
                          <h3>{city.name}</h3>
                          <div className="city-rating">
                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                            <span>{city.popularityScore.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="city-country"><MapPin size={13} /> {city.country}</p>
                        <p className="city-desc">{city.description}</p>
                        <div className="city-footer-row">
                          <span className="cost-index-badge">{city.costIndex}</span>
                          <span className="daily-cost">
                            <DollarSign size={13} /> ${city.avgDailyCost}/day
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* STEP 2: Trip Information & Travel Dates */}
          <section className="form-section">
            <div className="section-header">
              <div className="step-number">2</div>
              <div>
                <h2>Trip Details & Travel Dates</h2>
                <p>Provide a title and schedule your travel duration</p>
              </div>
            </div>

            <div className="form-grid-2">
              {/* Trip Title */}
              <div className="input-group span-2">
                <label htmlFor="trip-title" className="input-label">
                  Trip Title <span className="required">*</span>
                </label>
                <input
                  id="trip-title"
                  type="text"
                  placeholder="e.g. Summer Vacation in Paris"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  className={`styled-input ${errors.title ? 'error' : ''}`}
                />
                {errors.title && (
                  <div className="field-error-box"><AlertCircle size={14} /> {errors.title}</div>
                )}
              </div>

              {/* Start Date */}
              <div className="input-group">
                <label htmlFor="start-date" className="input-label">
                  Start Date <span className="required">*</span>
                </label>
                <div className="date-input-container">
                  <Calendar className="input-icon-left" size={18} />
                  <input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({ ...formData, startDate: e.target.value });
                      if (errors.startDate) setErrors({ ...errors, startDate: '' });
                    }}
                    className={`styled-input with-icon ${errors.startDate ? 'error' : ''}`}
                  />
                </div>
                {errors.startDate && (
                  <div className="field-error-box"><AlertCircle size={14} /> {errors.startDate}</div>
                )}
              </div>

              {/* End Date */}
              <div className="input-group">
                <label htmlFor="end-date" className="input-label">
                  End Date <span className="required">*</span>
                </label>
                <div className="date-input-container">
                  <Calendar className="input-icon-left" size={18} />
                  <input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      if (errors.endDate) setErrors({ ...errors, endDate: '' });
                    }}
                    className={`styled-input with-icon ${errors.endDate ? 'error' : ''}`}
                  />
                </div>
                {errors.endDate && (
                  <div className="field-error-box"><AlertCircle size={14} /> {errors.endDate}</div>
                )}
              </div>
            </div>

            {/* Dynamic Duration Banner */}
            {tripDuration && (
              <div className="duration-banner">
                <Info size={18} />
                <span>Trip Duration: <strong>{tripDuration}</strong></span>
              </div>
            )}

            {/* Description (Optional) */}
            <div className="input-group" style={{ marginTop: '1.2rem' }}>
              <label htmlFor="trip-desc" className="input-label">
                Trip Description <span className="optional">(Optional)</span>
              </label>
              <textarea
                id="trip-desc"
                rows={3}
                placeholder="What is the goal of this trip? (e.g. Family holiday, food exploration, mountain relaxation)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="styled-textarea"
              />
            </div>
          </section>

          {/* STEP 3: Review & Submit */}
          {selectedCity && (
            <section className="form-section review-section">
              <div className="section-header">
                <div className="step-number">3</div>
                <div>
                  <h2>Review Trip Summary</h2>
                  <p>Confirm details before creating your trip</p>
                </div>
              </div>

              <div className="summary-card">
                <img src={selectedCity.imageUrl} alt={selectedCity.name} className="summary-img" />
                <div className="summary-info">
                  <h3>{formData.title || `Trip to ${selectedCity.name}`}</h3>
                  <p className="summary-location"><MapPin size={14} /> {selectedCity.name}, {selectedCity.country}</p>
                  {tripDuration && <p className="summary-dates"><Calendar size={14} /> {formData.startDate} to {formData.endDate} ({tripDuration})</p>}
                  <p className="summary-budget">Estimated Cost: ~${(selectedCity.avgDailyCost * 5).toFixed(0)} total</p>
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="form-actions-row">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-create-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-white" /> Creating Trip...
                </>
              ) : (
                <>
                  Create Trip & Build Itinerary <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
