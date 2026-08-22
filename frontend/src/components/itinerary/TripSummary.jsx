import React from 'react';
import { Calendar, MapPin, DollarSign, Clock, PieChart, Sparkles } from 'lucide-react';

export function TripSummary({ trip, stats }) {
  if (!trip) return null;

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

  const totalBudget = trip.totalBudget || 0;
  const estimatedCost = stats?.totalEstimatedCost || 0;
  const remaining = stats?.remainingBudget ?? (totalBudget - estimatedCost);
  const isOverBudget = remaining < 0;

  return (
    <div className="trip-summary-card">
      <div className="summary-main-info">
        <div className="summary-badge">
          <Sparkles size={14} /> Master Trip Summary
        </div>
        <h1 className="summary-title">{trip.title}</h1>
        
        <div className="summary-meta-grid">
          <div className="summary-meta-item">
            <MapPin size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Destinations</span>
              <span className="meta-value">
                {trip.stops?.length > 0
                  ? trip.stops.map((s) => s.city?.name).filter(Boolean).join(' → ')
                  : 'No stops added'}
              </span>
            </div>
          </div>

          <div className="summary-meta-item">
            <Calendar size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Trip Dates</span>
              <span className="meta-value">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>
          </div>

          <div className="summary-meta-item">
            <Clock size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Duration</span>
              <span className="meta-value">{calculateDays()} Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-budget-info">
        <div className="budget-card-header">
          <PieChart size={18} />
          <span>Budget & Expenses Breakdown</span>
        </div>

        <div className="budget-metrics-grid">
          <div className="budget-metric">
            <span className="b-label">Total Trip Budget</span>
            <span className="b-value text-primary">${totalBudget.toLocaleString()}</span>
          </div>

          <div className="budget-metric">
            <span className="b-label">Est. Activity Cost</span>
            <span className="b-value text-sky">${estimatedCost.toLocaleString()}</span>
          </div>

          <div className="budget-metric">
            <span className="b-label">Remaining Balance</span>
            <span className={`b-value ${isOverBudget ? 'text-danger' : 'text-success'}`}>
              ${Math.abs(remaining).toLocaleString()} {isOverBudget ? '(Over Budget)' : ''}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="budget-progress-bar">
          <div
            className={`progress-fill ${isOverBudget ? 'over' : ''}`}
            style={{
              width: `${totalBudget > 0 ? Math.min(100, (estimatedCost / totalBudget) * 100) : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
