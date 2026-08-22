import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItineraryHeader } from '../components/itinerary/ItineraryHeader';
import { ItineraryStop } from '../components/itinerary/ItineraryStop';
import { EmptyItinerary } from '../components/itinerary/EmptyItinerary';
import { AddStopModal } from '../components/itinerary/AddStopModal';
import { AddActivityModal } from '../components/itinerary/AddActivityModal';
import { AddExpenseModal } from '../components/itinerary/AddExpenseModal';
import { ToastContainer } from '../components/Toast';
import { itineraryService } from '../services/itineraryService';
import { tripService } from '../services/tripService';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  PieChart,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  Utensils,
  Camera,
  Bike,
  Compass
} from 'lucide-react';

export function BuildItineraryPage() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStopId, setFilterStopId] = useState('All');
  const [sortBy, setSortBy] = useState('chronological');

  // Modal States
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Toast State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Load itinerary & trip data
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      loadItinerary();
    }
  }, [tripId]);

  // Dynamic Budget & Expense Calculations
  const budgetMetrics = useMemo(() => {
    if (!itinerary) {
      return {
        totalBudget: 0,
        totalActivityCost: 0,
        totalExpenseAmount: 0,
        totalSpending: 0,
        remainingBudget: 0,
        percentUsed: 0,
        status: 'Within Budget',
        categoryTotals: {
          Transport: 0,
          Stay: 0,
          Activity: 0,
          Meals: 0,
          Miscellaneous: 0,
        },
      };
    }

    const totalBudget = itinerary.totalBudget || 0;

    // Calculate total activity costs
    let totalActivityCost = 0;
    (itinerary.stops || []).forEach((stop) => {
      (stop.activities || []).forEach((act) => {
        totalActivityCost += act.cost || 0;
      });
    });

    // Calculate recorded expenses by category
    const categoryTotals = {
      Transport: 0,
      Stay: 0,
      Activity: totalActivityCost,
      Meals: 0,
      Miscellaneous: 0,
    };

    let totalExpenseAmount = 0;
    (itinerary.expenses || []).forEach((exp) => {
      const amount = exp.amount || 0;
      totalExpenseAmount += amount;

      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += amount;
      } else {
        categoryTotals.Miscellaneous += amount;
      }
    });

    const totalSpending = totalActivityCost + totalExpenseAmount;
    const remainingBudget = totalBudget - totalSpending;
    const percentUsed = totalBudget > 0 ? Math.min(100, Math.round((totalSpending / totalBudget) * 100)) : 0;

    let status = 'Within Budget';
    if (totalSpending > totalBudget && totalBudget > 0) {
      status = 'Over Budget';
    } else if (percentUsed >= 85) {
      status = 'Budget Almost Reached';
    }

    return {
      totalBudget,
      totalActivityCost,
      totalExpenseAmount,
      totalSpending,
      remainingBudget,
      percentUsed,
      status,
      categoryTotals,
    };
  }, [itinerary]);

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

    const temp = stops[index];
    stops[index] = stops[targetIdx];
    stops[targetIdx] = temp;

    setItinerary((prev) => ({ ...prev, stops }));

    const stopIds = stops.map((s) => s.id);
    setIsSaving(true);
    try {
      await itineraryService.reorderStops(tripId, stopIds);
      addToast('Stops reordered successfully.', 'success');
    } catch (err) {
      addToast('Failed to save stop order.', 'error');
      await loadItinerary();
    } finally {
      setIsSaving(false);
    }
  };

  // --- ACTIVITY OPERATIONS ---
  const handleOpenAddActivity = (stop) => {
    setActiveStopForActivity(stop || itinerary?.stops?.[0] || null);
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
    if (!activeStopForActivity) {
      addToast('Please create or select a destination stop first.', 'error');
      return;
    }

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

  // --- EXPENSE OPERATIONS ---
  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = async (expenseData) => {
    setIsSaving(true);
    try {
      if (editingExpense) {
        await itineraryService.updateExpense(tripId, editingExpense.id, expenseData);
        addToast('Expense updated successfully.', 'success');
      } else {
        await itineraryService.createExpense(tripId, expenseData);
        addToast('Expense recorded successfully.', 'success');
      }
      setIsExpenseModalOpen(false);
      await loadItinerary();
    } catch (err) {
      addToast(err.message || 'Failed to save expense.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) {
      return;
    }

    setIsSaving(true);
    try {
      await itineraryService.deleteExpense(tripId, expenseId);
      addToast('Expense deleted.', 'info');
      await loadItinerary();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = () => {
    if (!itinerary?.startDate || !itinerary?.endDate) return 1;
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diffTime = Math.abs(end - start);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  };

  if (loading) {
    return (
      <div className="build-itinerary-loading">
        <div className="spinner-navy" />
        <p>Loading your trip itinerary and budget...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="build-itinerary-error">
        <AlertTriangle size={36} color="#EF4444" />
        <h2>Itinerary Unavailable</h2>
        <p>{error || 'The requested trip itinerary could not be loaded.'}</p>
        <div className="error-actions-row">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn-primary" onClick={loadItinerary}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const stops = itinerary.stops || [];
  const expenses = itinerary.expenses || [];

  return (
    <div className="build-itinerary-container">
      {/* 1. Header Bar */}
      <ItineraryHeader
        trip={itinerary}
        onBack={() => navigate('/dashboard')}
        isSaving={isSaving}
      />

      <main className="build-itinerary-main">
        {/* 2. Hero Cover Banner */}
        <section
          className="itinerary-hero-banner"
          style={{
            backgroundImage: `url(${
              itinerary.coverPhotoUrl || stops[0]?.city?.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
            })`,
          }}
        >
          <div className="hero-gradient-overlay" />
          <div className="hero-content-wrapper">
            <div className="hero-top-badge">
              <Compass size={14} /> DETAILED TRAVEL ITINERARY & BUDGET
            </div>
            <h1 className="hero-trip-title">{itinerary.title}</h1>
            <p className="hero-trip-subtitle">
              {itinerary.description || 'Customized travel itinerary, scheduled activities, and expense breakdown.'}
            </p>

            <div className="hero-meta-row">
              <div className="meta-badge-pill">
                <MapPin size={14} />
                <span>
                  {stops.length > 0
                    ? stops.map((s) => s.city?.name).filter(Boolean).join(' → ')
                    : 'Destination Set'}
                </span>
              </div>

              <div className="meta-badge-pill">
                <Calendar size={14} />
                <span>
                  {formatDate(itinerary.startDate)} — {formatDate(itinerary.endDate)}
                </span>
              </div>

              <div className="meta-badge-pill highlight">
                <Clock size={14} />
                <span>{calculateDays()} Days / {Math.max(1, calculateDays() - 1)} Nights</span>
              </div>
            </div>

            <div className="hero-actions-row">
              <button
                type="button"
                className="btn-hero-action primary"
                onClick={() => handleOpenAddActivity(null)}
              >
                <Plus size={16} /> Add Activity
              </button>
              <button
                type="button"
                className="btn-hero-action secondary"
                onClick={handleOpenAddExpense}
              >
                <DollarSign size={16} /> Add Expense
              </button>
            </div>
          </div>
        </section>

        {/* 3. Budget Overview Card & Category Breakdown */}
        <section className="budget-dashboard-section">
          <div className="budget-master-card">
            {/* Header Status Row */}
            <div className="budget-card-title-row">
              <div className="title-with-icon">
                <PieChart size={22} className="text-navy" />
                <h2>Trip Budget & Spending Summary</h2>
              </div>
              <span
                className={`budget-status-pill ${
                  budgetMetrics.status === 'Over Budget'
                    ? 'danger'
                    : budgetMetrics.status === 'Budget Almost Reached'
                    ? 'warning'
                    : 'success'
                }`}
              >
                {budgetMetrics.status === 'Over Budget' ? '⚠️ Over Budget' : budgetMetrics.status === 'Budget Almost Reached' ? '⚡ Budget Almost Reached' : '✓ Within Budget'}
              </span>
            </div>

            {/* Metrics 4-Column Row */}
            <div className="budget-stats-grid">
              <div className="stat-box">
                <span className="stat-label">Total Allocated Budget</span>
                <span className="stat-amount primary">${budgetMetrics.totalBudget.toLocaleString()}</span>
              </div>

              <div className="stat-box">
                <span className="stat-label">Activity Cost</span>
                <span className="stat-amount sky">${budgetMetrics.totalActivityCost.toLocaleString()}</span>
              </div>

              <div className="stat-box">
                <span className="stat-label">Recorded Expenses</span>
                <span className="stat-amount purple">${budgetMetrics.totalExpenseAmount.toLocaleString()}</span>
              </div>

              <div className="stat-box">
                <span className="stat-label">Remaining Balance</span>
                <span className={`stat-amount ${budgetMetrics.remainingBudget < 0 ? 'danger' : 'success'}`}>
                  ${Math.abs(budgetMetrics.remainingBudget).toLocaleString()}
                  {budgetMetrics.remainingBudget < 0 ? ' Over' : ' Left'}
                </span>
              </div>
            </div>

            {/* Overall Progress Meter */}
            <div className="budget-progress-block">
              <div className="progress-label-row">
                <span>Total Spending Progress ({budgetMetrics.percentUsed}% used)</span>
                <span>${budgetMetrics.totalSpending.toLocaleString()} / ${budgetMetrics.totalBudget.toLocaleString()}</span>
              </div>
              <div className="master-progress-bar">
                <div
                  className={`progress-fill-inner ${
                    budgetMetrics.remainingBudget < 0 ? 'over' : budgetMetrics.percentUsed >= 85 ? 'warning' : 'good'
                  }`}
                  style={{ width: `${budgetMetrics.percentUsed}%` }}
                />
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="category-breakdown-row">
              <h3>Category Expense Breakdown</h3>
              <div className="category-bars-grid">
                {Object.entries(budgetMetrics.categoryTotals).map(([cat, total]) => {
                  const pct = budgetMetrics.totalSpending > 0 ? Math.round((total / budgetMetrics.totalSpending) * 100) : 0;
                  return (
                    <div key={cat} className="cat-bar-item">
                      <div className="cat-header">
                        <span className="cat-name">{cat}</span>
                        <span className="cat-val">${total.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="cat-progress-track">
                        <div className="cat-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Expenses List Section */}
        <section className="expenses-manager-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-heading">
                <DollarSign size={20} /> Recorded Expenses ({expenses.length})
              </h2>
              <p className="section-subtext">Manage flights, hotel stays, meals, and trip purchases.</p>
            </div>
            <button type="button" className="btn-add-expense-cta" onClick={handleOpenAddExpense}>
              <Plus size={16} /> Record Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-expenses-card">
              <DollarSign size={36} color="#6587D2" />
              <h3>No expenses recorded yet</h3>
              <p>Track your travel spending to stay comfortably within your budget.</p>
              <button type="button" className="btn-empty-action" onClick={handleOpenAddExpense}>
                <Plus size={16} /> Add First Expense
              </button>
            </div>
          ) : (
            <div className="expenses-grid-cards">
              {expenses.map((exp) => (
                <div key={exp.id} className="expense-card">
                  <div className="expense-card-main">
                    <div className="expense-category-icon">
                      <Tag size={16} />
                    </div>
                    <div className="expense-info">
                      <h4 className="expense-title">{exp.title}</h4>
                      <div className="expense-meta">
                        <span className="cat-tag">{exp.category}</span>
                        <span>•</span>
                        <span>{formatDate(exp.expenseDate)}</span>
                      </div>
                    </div>
                    <div className="expense-amount-tag">${exp.amount?.toFixed(2)}</div>
                  </div>

                  <div className="expense-actions-bar">
                    <button
                      type="button"
                      className="btn-exp-action edit"
                      onClick={() => handleOpenEditExpense(exp)}
                      title="Edit Expense"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn-exp-action delete"
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete Expense"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Toolbar Controls: Search, Filter, Sort */}
        <section className="itinerary-toolbar-section">
          <div className="toolbar-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="toolbar-search-input"
              placeholder="Search itinerary activities or expenses by name, category, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>

          <div className="toolbar-dropdowns-row">
            <div className="select-control">
              <label><Filter size={13} /> Category</label>
              <select
                className="select-input"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Food">Food & Dining</option>
                <option value="Adventure">Adventure</option>
                <option value="Culture">Culture & History</option>
                <option value="Relaxation">Relaxation</option>
              </select>
            </div>

            <div className="select-control">
              <label><MapPin size={13} /> Destination Stop</label>
              <select
                className="select-input"
                value={filterStopId}
                onChange={(e) => setFilterStopId(e.target.value)}
              >
                <option value="All">All Destination Stops</option>
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.city?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-control">
              <label><ArrowUpDown size={13} /> Sort By</label>
              <select
                className="select-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="chronological">Chronological (Timeline)</option>
                <option value="cost-low">Cost: Low to High</option>
                <option value="cost-high">Cost: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* 6. Day-by-Day Itinerary Timeline Section */}
        <section className="itinerary-timeline-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-heading">
                <Calendar size={20} /> Day-by-Day Travel Itinerary
              </h2>
              <p className="section-subtext">Chronological daily breakdown of destination stops and physical activities.</p>
            </div>
            <button type="button" className="btn-add-stop-cta" onClick={handleOpenAddStop}>
              <Plus size={16} /> Add Destination Stop
            </button>
          </div>

          {stops.length > 0 ? (
            <div className="stops-vertical-list">
              {stops
                .filter((s) => filterStopId === 'All' || s.id === filterStopId)
                .map((stop, idx) => (
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
        </section>
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

      {/* Add / Edit Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleSaveExpense}
        stops={stops}
        initialData={editingExpense}
        isLoading={isSaving}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))}
      />
    </div>
  );
}
