import React from 'react';
import { ActivityCard } from './ActivityCard';
import { 
  MapPin, Calendar, Plus, Edit3, Trash2, ArrowUp, ArrowDown, FileText, Compass, Info 
} from 'lucide-react';

export function ItineraryStop({
  stop,
  index,
  totalStops,
  onEditStop,
  onDeleteStop,
  onMoveStopUp,
  onMoveStopDown,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onMoveActivityUp,
  onMoveActivityDown,
}) {
  const city = stop.city;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = () => {
    if (!stop.startDate || !stop.endDate) return 1;
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const activities = stop.activities || [];
  const stopTotalCost = activities.reduce((sum, act) => sum + (act.cost || 0), 0);

  return (
    <div className="itinerary-stop-card" id={`stop-${stop.id}`}>
      {/* Stop Header */}
      <div className="stop-header">
        <div className="stop-header-title-group">
          <div className="stop-reorder-buttons">
            <button
              type="button"
              className="btn-stop-reorder"
              onClick={onMoveStopUp}
              disabled={index === 0}
              title="Move Destination Up"
            >
              <ArrowUp size={14} />
            </button>
            <span className="stop-number-badge">STOP #{index + 1}</span>
            <button
              type="button"
              className="btn-stop-reorder"
              onClick={onMoveStopDown}
              disabled={index === totalStops - 1}
              title="Move Destination Down"
            >
              <ArrowDown size={14} />
            </button>
          </div>

          <div className="stop-city-details">
            <h3 className="stop-city-name">
              {city ? `${city.name}, ${city.country}` : 'Destination Stop'}
            </h3>
            <div className="stop-meta-row">
              {city?.region && <span className="stop-tag">{city.region}</span>}
              <span className="stop-meta-item">
                <Calendar size={13} /> {formatDate(stop.startDate)} – {formatDate(stop.endDate)} ({calculateDays()} Days)
              </span>
            </div>
          </div>
        </div>

        <div className="stop-header-actions">
          <div className="stop-cost-badge">
            Est: ${stopTotalCost.toFixed(2)}
          </div>
          <button
            type="button"
            className="btn-stop-action btn-edit"
            onClick={() => onEditStop(stop)}
            title="Edit Stop Details"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            className="btn-stop-action btn-delete"
            onClick={() => onDeleteStop(stop.id)}
            title="Delete Stop"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stop Notes Banner */}
      {stop.notes && (
        <div className="stop-notes-box">
          <FileText size={14} className="notes-icon" />
          <p>{stop.notes}</p>
        </div>
      )}

      {/* City Preview Card */}
      {city && (
        <div className="stop-city-banner">
          <img src={city.imageUrl} alt={city.name} className="stop-city-img" />
          <div className="stop-city-info">
            <p className="city-desc">{city.description}</p>
            <div className="city-stats-row">
              <span>Avg Daily: <strong>${city.avgDailyCost}</strong></span>
              <span>Cost Index: <strong>{city.costIndex}</strong></span>
              <span>Popularity: <strong>⭐ {city.popularityScore}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Activities Section in Stop */}
      <div className="stop-activities-container">
        <div className="activities-header">
          <h4>
            Scheduled Activities ({activities.length})
          </h4>
          <button
            type="button"
            className="btn-add-activity-cta"
            onClick={() => onAddActivity(stop)}
          >
            <Plus size={15} />
            <span>Add Activity</span>
          </button>
        </div>

        {activities.length > 0 ? (
          <div className="activities-list">
            {activities.map((act, actIdx) => (
              <ActivityCard
                key={act.id}
                activity={act}
                index={actIdx}
                totalCount={activities.length}
                onEdit={onEditActivity}
                onDelete={(actId) => onDeleteActivity(stop.id, actId)}
                onMoveUp={() => onMoveActivityUp(stop.id, actIdx)}
                onMoveDown={() => onMoveActivityDown(stop.id, actIdx)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-activities-state">
            <Info size={24} color="#6587D2" />
            <p>No activities planned for this destination yet.</p>
            <button
              type="button"
              className="btn-inline-add"
              onClick={() => onAddActivity(stop)}
            >
              <Plus size={14} /> Add First Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
