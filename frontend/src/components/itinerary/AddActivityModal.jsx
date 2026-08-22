import React, { useState, useEffect } from 'react';
import { 
  X, Tag, Calendar, Clock, DollarSign, Plus, AlertCircle, Info, Check, Sparkles 
} from 'lucide-react';

export function AddActivityModal({
  isOpen,
  onClose,
  onSubmit,
  stop = null,
  initialData = null,
  isLoading = false,
}) {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'custom'
  const [selectedActivityId, setSelectedActivityId] = useState(initialData?.activityId || '');
  const [customName, setCustomName] = useState(initialData?.customName || '');
  const [category, setCategory] = useState(initialData?.category || 'Sightseeing');
  const [scheduledDate, setScheduledDate] = useState(
    initialData?.scheduledDate
      ? new Date(initialData.scheduledDate).toISOString().split('T')[0]
      : stop?.startDate
      ? new Date(stop.startDate).toISOString().split('T')[0]
      : ''
  );
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '11:00');
  const [cost, setCost] = useState(initialData?.cost !== undefined ? initialData.cost : '');
  const [error, setError] = useState('');

  const cityActivities = stop?.city?.activities || [];

  useEffect(() => {
    if (initialData) {
      if (initialData.activityId) {
        setActiveTab('existing');
        setSelectedActivityId(initialData.activityId);
      } else {
        setActiveTab('custom');
        setSelectedActivityId('');
      }
      setCustomName(initialData.customName || '');
      setCategory(initialData.category || 'Sightseeing');
      setScheduledDate(
        initialData.scheduledDate
          ? new Date(initialData.scheduledDate).toISOString().split('T')[0]
          : ''
      );
      setStartTime(initialData.startTime || '09:00');
      setEndTime(initialData.endTime || '11:00');
      setCost(initialData.cost !== undefined ? initialData.cost : '');
    } else {
      setActiveTab('existing');
      setSelectedActivityId('');
      setCustomName('');
      setCategory('Sightseeing');
      setScheduledDate(
        stop?.startDate ? new Date(stop.startDate).toISOString().split('T')[0] : ''
      );
      setStartTime('09:00');
      setEndTime('11:00');
      setCost('');
    }
    setError('');
  }, [initialData, stop, isOpen]);

  if (!isOpen) return null;

  const handleSelectPredefActivity = (act) => {
    setSelectedActivityId(act.id);
    setCustomName(act.name);
    setCategory(act.category || 'Sightseeing');
    if (act.estimatedCost) {
      setCost(act.estimatedCost);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'existing' && !selectedActivityId && !customName.trim()) {
      setError('Please select an activity or enter a name.');
      return;
    }

    if (activeTab === 'custom' && !customName.trim()) {
      setError('Custom activity name is required.');
      return;
    }

    if (!scheduledDate) {
      setError('Scheduled date is required.');
      return;
    }

    if (cost !== '' && parseFloat(cost) < 0) {
      setError('Cost cannot be negative.');
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    setError('');
    onSubmit({
      activityId: activeTab === 'existing' ? selectedActivityId : null,
      customName: customName.trim(),
      category,
      scheduledDate,
      startTime,
      endTime,
      cost: cost !== '' ? parseFloat(cost) : 0,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-group">
          <h3 className="modal-title">
            {initialData ? 'Edit Activity' : `Add Activity for ${stop?.city?.name || 'Stop'}`}
          </h3>
          <p className="modal-subtitle">
            Choose a recommended activity in {stop?.city?.name} or create your own custom activity.
          </p>
        </div>

        {/* Tab Selection */}
        {!initialData && (
          <div className="modal-tabs-bar">
            <button
              type="button"
              className={`modal-tab-btn ${activeTab === 'existing' ? 'active' : ''}`}
              onClick={() => setActiveTab('existing')}
            >
              Recommended City Activities ({cityActivities.length})
            </button>
            <button
              type="button"
              className={`modal-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              + Custom Activity
            </button>
          </div>
        )}

        {error && (
          <div className="modal-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Tab 1: Pre-defined activities */}
          {activeTab === 'existing' && !initialData && (
            <div className="form-group">
              <label className="form-label">Choose from {stop?.city?.name} Destinations & Sights</label>
              {cityActivities.length > 0 ? (
                <div className="predef-activities-list">
                  {cityActivities.map((act) => {
                    const isSelected = selectedActivityId === act.id;
                    return (
                      <div
                        key={act.id}
                        className={`predef-act-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectPredefActivity(act)}
                      >
                        <div className="act-details">
                          <div className="act-title-row">
                            <h4>{act.name}</h4>
                            <span className="act-tag">{act.category}</span>
                          </div>
                          <p>{act.description}</p>
                          <div className="act-meta-info">
                            <span>Est: ${act.estimatedCost}</span>
                            <span>Duration: {act.durationHours}h</span>
                          </div>
                        </div>
                        {isSelected && <Check size={18} className="check-icon" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-predef-box">
                  <Info size={20} />
                  <p>No predefined activities found for this city. Create a custom activity below!</p>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => setActiveTab('custom')}
                  >
                    Switch to Custom Activity
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Custom Name / Title */}
          {(activeTab === 'custom' || selectedActivityId || initialData) && (
            <div className="form-group">
              <label className="form-label">Activity Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Visit Eiffel Tower, Lunch at Cafe, Scuba Diving..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Sightseeing">Sightseeing</option>
              <option value="Food">Food & Dining</option>
              <option value="Adventure">Adventure & Sports</option>
              <option value="Culture">Culture & Art</option>
              <option value="Relaxation">Relaxation & Spa</option>
              <option value="Transport">Transport & Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date & Time Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scheduled Date *</label>
              <div className="input-container">
                <Calendar size={16} className="input-icon" />
                <input
                  type="date"
                  className="form-input"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Est. Cost ($)</label>
              <div className="input-container">
                <DollarSign size={16} className="input-icon" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Start and End Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <div className="input-container">
                <Clock size={16} className="input-icon" />
                <input
                  type="time"
                  className="form-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <div className="input-container">
                <Clock size={16} className="input-icon" />
                <input
                  type="time"
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>Saving Activity...</>
              ) : (
                <>{initialData ? 'Update Activity' : 'Add Activity'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
