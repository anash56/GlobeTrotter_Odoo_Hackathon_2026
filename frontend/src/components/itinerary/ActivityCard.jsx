import React from 'react';
import { 
  Clock, Calendar, DollarSign, ArrowUp, ArrowDown, Edit3, Trash2, Tag, Info 
} from 'lucide-react';

export function ActivityCard({
  activity,
  index,
  totalCount,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const name = activity.customName || activity.activity?.name || 'Scheduled Activity';
  const description = activity.activity?.description || '';

  return (
    <div className="activity-item-card">
      <div className="activity-card-left">
        <div className="activity-reorder-controls">
          <button
            type="button"
            className="btn-reorder"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move Up"
          >
            <ArrowUp size={14} />
          </button>
          <span className="activity-index-badge">#{index + 1}</span>
          <button
            type="button"
            className="btn-reorder"
            onClick={onMoveDown}
            disabled={index === totalCount - 1}
            title="Move Down"
          >
            <ArrowDown size={14} />
          </button>
        </div>

        <div className="activity-main-details">
          <div className="activity-header-row">
            <span className="activity-category-tag">
              <Tag size={12} /> {activity.category || 'Sightseeing'}
            </span>
            {activity.scheduledDate && (
              <span className="activity-date-tag">
                <Calendar size={12} /> {formatDate(activity.scheduledDate)}
              </span>
            )}
            {(activity.startTime || activity.endTime) && (
              <span className="activity-time-tag">
                <Clock size={12} /> {activity.startTime || '--:--'} - {activity.endTime || '--:--'}
              </span>
            )}
          </div>

          <h4 className="activity-title">{name}</h4>

          {description && (
            <p className="activity-desc">{description}</p>
          )}

          <div className="activity-footer-row">
            <span className="activity-cost">
              <DollarSign size={14} /> ${activity.cost?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>

      <div className="activity-card-actions">
        <button
          type="button"
          className="btn-icon-action btn-edit"
          onClick={() => onEdit(activity)}
          title="Edit Activity"
        >
          <Edit3 size={15} />
        </button>
        <button
          type="button"
          className="btn-icon-action btn-delete"
          onClick={() => onDelete(activity.id)}
          title="Delete Activity"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
