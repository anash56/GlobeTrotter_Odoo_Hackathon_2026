import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItineraryHeader } from '../components/itinerary/ItineraryHeader';
import { TripSummary } from '../components/itinerary/TripSummary';
import { ItineraryStop } from '../components/itinerary/ItineraryStop';
import { EmptyItinerary } from '../components/itinerary/EmptyItinerary';
import { AddStopModal } from '../components/itinerary/AddStopModal';
import { AddActivityModal } from '../components/itinerary/AddActivityModal';
import { ToastContainer } from '../components/Toast';
import { itineraryService } from '../services/itineraryService';
import { Plus, Info, RefreshCw, AlertCircle } from 'lucide-react';

export function BuildItineraryPage() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Modal States
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Load itinerary data
  const loadItinerary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await itineraryService.getItinerary(tripId);
      setItinerary(data);
    } catch (err) {
      console.error('Fetch itinerary error:', err);
      setError(err.message || 'Failed to load trip itinerary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      loadItinerary();
    }
  }, [tripId]);

  // --- STOP OPERATIONS ---
  const handleOpenAddStop = () => {
    setEditingStop(null);
    setIsStopModalOpen(true);
  };

  const handleOpenEditStop = (stop) => {
    setEditingStop(stop);
    setIsStopModalOpen(true);
  };

  const handleSaveStop = async (stopData) => {
    setIsSaving(true);
    try {
      if (editingStop) {
        await itineraryService.updateStop(tripId, editingStop.id, stopData);
        addToast('Destination stop updated successfully.', 'success');
      } else {
        await itineraryService.createStop(tripId, stopData);
        addToast('Destination stop added to itinerary.', 'success');
      }
      setIsStopModalOpen(false);
      await loadItinerary();
    } catch (err) {
      addToast(err.message || 'Failed to save stop.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to remove this destination stop and all its scheduled activities?')) {
      return;
    }

    setIsSaving(true);
    try {
      await itineraryService.deleteStop(tripId, stopId);
      addToast('Destination stop deleted.', 'info');
      await loadItinerary();
    } catch (err) {
      addToast(err.message || 'Failed to delete stop.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveStop = async (index, direction) => {
    if (!itinerary?.stops) return;
    const stops = [...itinerary.stops];
    const targetIdx = index + direction;

    if (targetIdx < 0 || targetIdx >= stops.length) return;

    // Swap elements
    const temp = stops[index];
    stops[index] = stops[targetIdx];
    stops[targetIdx] = temp;

    // Optimistic UI update
    setItinerary((prev) => ({ ...prev, stops }));

    const stopIds = stops.map((s) => s.id);
    setIsSaving(true);
    try {
      await itineraryService.reorderStops(tripId, stopIds);
      addToast('Stops reordered successfully.', 'success');
    } catch (err) {
      addToast('Failed to save stop order.', 'error');
      await loadItinerary(); // Revert on failure
    } finally {
      setIsSaving(false);
    }
  };

  // --- ACTIVITY OPERATIONS ---
  const handleOpenAddActivity = (stop) => {
    setActiveStopForActivity(stop);
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (activity) => {
    const stop = itinerary?.stops?.find((s) => s.id === activity.tripStopId);
    setActiveStopForActivity(stop);
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async (activityData) => {
    if (!activeStopForActivity) return;
    setIsSaving(true);
    try {
      if (editingActivity) {
        await itineraryService.updateActivity(
          tripId,
          activeStopForActivity.id,
          editingActivity.id,
          activityData
        );
        addToast('Activity updated successfully.', 'success');
      } else {
        await itineraryService.createActivity(
          tripId,
          activeStopForActivity.id,
          activityData
        );
        addToast('Activity added to itinerary.', 'success');
      }
      setIsActivityModalOpen(false);
      await loadItinerary();
    } catch (err) {
      addToast(err.message || 'Failed to save activity.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteActivity = async (stopId, activityId) => {
    if (!window.confirm('Are you sure you want to remove this activity?')) {
      return;
    }

    setIsSaving(true);
    try {
      await itineraryService.deleteActivity(tripId, stopId, activityId);
      addToast('Activity removed.', 'info');
      await loadItinerary();
    } catch (err) {
      addToast(err.message || 'Failed to delete activity.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveActivity = async (stopId, index, direction) => {
    const stop = itinerary?.stops?.find((s) => s.id === stopId);
    if (!stop || !stop.activities) return;

    const activities = [...stop.activities];
    const targetIdx = index + direction;

    if (targetIdx < 0 || targetIdx >= activities.length) return;

    const temp = activities[index];
    activities[index] = activities[targetIdx];
    activities[targetIdx] = temp;

    // Optimistic UI update
    setItinerary((prev) => ({
      ...prev,
      stops: prev.stops.map((s) => (s.id === stopId ? { ...s, activities } : s)),
    }));

    const activityIds = activities.map((a) => a.id);
    setIsSaving(true);
    try {
      await itineraryService.reorderActivities(tripId, stopId, activityIds);
    } catch (err) {
      addToast('Failed to save activity order.', 'error');
      await loadItinerary();
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="build-itinerary-loading">
        <div className="spinner-navy" />
        <p>Loading your trip itinerary...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="build-itinerary-error">
        <AlertCircle size={36} color="#EF4444" />
        <h2>Itinerary Unavailable</h2>
        <p>{error || 'The requested trip itinerary could not be loaded.'}</p>
        <div className="error-actions-row">
          <button className="btn-secondary" onClick={() => navigate(`/trips/${tripId}`)}>
            Back to Trip
          </button>
          <button className="btn-primary" onClick={loadItinerary}>
            <RefreshCw size={16} /> Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const stops = itinerary.stops || [];

  return (
    <div className="build-itinerary-container">
      {/* 1. Header Bar */}
      <ItineraryHeader
        trip={itinerary}
        onBack={() => navigate(`/trips/${tripId}`)}
        isSaving={isSaving}
      />

      <main className="build-itinerary-main">
        {/* 2. Trip Summary & Budget Metrics */}
        <TripSummary trip={itinerary} stats={itinerary.stats} />

        {/* 3. Section List of Trip Stops & Activities */}
        <div className="itinerary-stops-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Day-by-Day Itinerary Stops</h2>
              <p className="section-desc">
                Organize destination stops, schedule activities, and track daily spending.
              </p>
            </div>
            <button
              type="button"
              className="btn-add-stop-cta"
              onClick={handleOpenAddStop}
            >
              <Plus size={18} />
              <span>Add Destination Stop</span>
            </button>
          </div>

          {stops.length > 0 ? (
            <div className="stops-vertical-list">
              {stops.map((stop, idx) => (
                <ItineraryStop
                  key={stop.id}
                  stop={stop}
                  index={idx}
                  totalStops={stops.length}
                  onEditStop={handleOpenEditStop}
                  onDeleteStop={handleDeleteStop}
                  onMoveStopUp={() => handleMoveStop(idx, -1)}
                  onMoveStopDown={() => handleMoveStop(idx, 1)}
                  onAddActivity={handleOpenAddActivity}
                  onEditActivity={handleOpenEditActivity}
                  onDeleteActivity={handleDeleteActivity}
                  onMoveActivityUp={(sId, aIdx) => handleMoveActivity(sId, aIdx, -1)}
                  onMoveActivityDown={(sId, aIdx) => handleMoveActivity(sId, aIdx, 1)}
                />
              ))}
            </div>
          ) : (
            <EmptyItinerary onAddStop={handleOpenAddStop} />
          )}
        </div>
      </main>

      {/* Add / Edit Stop Modal */}
      <AddStopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onSubmit={handleSaveStop}
        initialData={editingStop}
        tripDates={{ startDate: itinerary.startDate, endDate: itinerary.endDate }}
        isLoading={isSaving}
      />

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleSaveActivity}
        stop={activeStopForActivity}
        initialData={editingActivity}
        isLoading={isSaving}
      />

      {/* Toast Feedback Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))}
      />
    </div>
  );
}
