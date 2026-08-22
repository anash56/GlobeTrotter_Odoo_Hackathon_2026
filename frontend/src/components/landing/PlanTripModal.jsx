import React, { useState } from 'react';
import { X, Calendar, MapPin, DollarSign, Plus, AlertCircle } from 'lucide-react';

export function PlanTripModal({ isOpen, onClose, onSubmit, isLoading, isLoggedIn, onOpenAuth }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a trip title.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Please select start and end dates.');
      return;
    }

    setError('');
    await onSubmit(formData);
    setFormData({ title: '', description: '', startDate: '', endDate: '', totalBudget: '' });
    onClose();
  };

  return (
    <div className="landing-modal-backdrop" onClick={onClose}>
      <div className="landing-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="landing-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className="modal-heading">Plan Your First Trip</h3>
        <p className="modal-subtext">
          Set up your destination, trip dates, and budget estimate.
        </p>

        <form onSubmit={handleSubmit} className="plan-trip-form">
          {error && (
            <div className="modal-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="form-field">
            <label>Trip Title *</label>
            <div className="input-with-icon">
              <MapPin size={16} className="field-icon" />
              <input
                type="text"
                placeholder="e.g. Summer in Tokyo & Kyoto"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Short Description</label>
            <textarea
              placeholder="Key highlights, notes, or companion details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Start Date *</label>
              <div className="input-with-icon">
                <Calendar size={16} className="field-icon" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>End Date *</label>
              <div className="input-with-icon">
                <Calendar size={16} className="field-icon" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-field">
            <label>Total Estimated Budget ($)</label>
            <div className="input-with-icon">
              <DollarSign size={16} className="field-icon" />
              <input
                type="number"
                placeholder="e.g. 1500"
                value={formData.totalBudget}
                onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-save-trip" disabled={isLoading}>
            {isLoading ? (
              <>Creating Trip...</>
            ) : (
              <>
                <Plus size={18} /> Save Trip Itinerary
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
