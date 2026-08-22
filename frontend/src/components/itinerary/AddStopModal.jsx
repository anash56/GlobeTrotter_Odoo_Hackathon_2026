import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, FileText, Search, Plus, AlertCircle, DollarSign, Star } from 'lucide-react';
import { cityService } from '../../services/cityService';

export function AddStopModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  tripDates = {},
  isLoading = false,
}) {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState(initialData?.cityId || '');
  const [startDate, setStartDate] = useState(initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
  const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [error, setError] = useState('');

  // Fetch available cities for selection
  useEffect(() => {
    if (isOpen) {
      cityService.getCities()
        .then((data) => setCities(data))
        .catch((err) => console.error('Error fetching cities:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setSelectedCityId(initialData.cityId || '');
      setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
      setEndDate(initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
      setNotes(initialData.notes || '');
    } else {
      setSelectedCityId('');
      setStartDate(tripDates.startDate ? new Date(tripDates.startDate).toISOString().split('T')[0] : '');
      setEndDate(tripDates.endDate ? new Date(tripDates.endDate).toISOString().split('T')[0] : '');
      setNotes('');
    }
    setError('');
  }, [initialData, tripDates, isOpen]);

  if (!isOpen) return null;

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCityId) {
      setError('Please select a destination city.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setError('End date cannot be before start date.');
      return;
    }

    setError('');
    onSubmit({
      cityId: selectedCityId,
      startDate,
      endDate,
      notes,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-group">
          <h3 className="modal-title">
            {initialData ? 'Edit Destination Stop' : 'Add Destination Stop'}
          </h3>
          <p className="modal-subtitle">
            Choose a destination city and set dates for this section of your itinerary.
          </p>
        </div>

        {error && (
          <div className="modal-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* City Selector Grid */}
          <div className="form-group">
            <label className="form-label">Select Destination City *</label>
            <div className="search-inline-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-inline-input"
                placeholder="Search city, country, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="cities-selection-grid">
              {filteredCities.map((city) => {
                const isSelected = selectedCityId === city.id;
                return (
                  <div
                    key={city.id}
                    className={`city-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedCityId(city.id)}
                  >
                    <img src={city.imageUrl} alt={city.name} className="city-thumb" />
                    <div className="city-info">
                      <div className="city-header">
                        <h4>{city.name}, {city.country}</h4>
                        <span className="rating-tag">⭐ {city.popularityScore}</span>
                      </div>
                      <p className="city-region">{city.region} • ${city.avgDailyCost}/day</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stop Start Date *</label>
              <div className="input-container">
                <Calendar size={16} className="input-icon" />
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Stop End Date *</label>
              <div className="input-container">
                <Calendar size={16} className="input-icon" />
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Stop Notes */}
          <div className="form-group">
            <label className="form-label">Stop Notes & Highlights (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Hotel reservation details, transit tips, or neighborhood plans..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>Saving Stop...</>
              ) : (
                <>{initialData ? 'Update Stop' : 'Add Stop'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
