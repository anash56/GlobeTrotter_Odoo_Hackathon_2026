import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  MapPin, 
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { tripService } from '../services/tripService';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarAgendaView } from '../components/calendar/CalendarAgendaView';
import { CalendarEventDrawer } from '../components/calendar/CalendarEventDrawer';
import { getTripStatus } from '../components/trips/TripListingCard';

export function CalendarPage() {
  const navigate = useNavigate();

  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'agenda'

  // Data State
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Trip / Day Drawer State
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-asc');

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tripService.getTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading calendar trips:', err);
      setError(err.message || 'Unable to load your calendar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handlers for month navigation
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setGroupBy('ALL');
    setFilterStatus('ALL');
    setSortBy('date-asc');
  };

  const handleSelectDay = (dateObj, cellData) => {
    setSelectedDay(dateObj);
    setSelectedDayData(cellData);
    if (cellData?.trips && cellData.trips.length > 0) {
      setSelectedTrip(cellData.trips[0]);
    } else {
      setSelectedTrip(null);
    }
  };

  // Filter and Sort Trips
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];

    // 1. Live Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((trip) => {
        const titleMatch = trip.title?.toLowerCase().includes(q);
        const descMatch = trip.description?.toLowerCase().includes(q);
        const destMatch = trip.stops?.some((s) =>
          s.city?.name?.toLowerCase().includes(q) ||
          s.city?.country?.toLowerCase().includes(q)
        );
        const actMatch = trip.stops?.some((s) =>
          s.activities?.some((a) =>
            a.customName?.toLowerCase().includes(q) ||
            a.activity?.name?.toLowerCase().includes(q)
          )
        );
        return titleMatch || descMatch || destMatch || actMatch;
      });
    }

    // 2. Status Filter
    if (filterStatus !== 'ALL') {
      result = result.filter((trip) => {
        const st = getTripStatus(trip.startDate, trip.endDate);
        return st === filterStatus;
      });
    }

    // 3. Group By Filter
    if (groupBy === 'DESTINATION') {
      result = result.filter((t) => t.stops && t.stops.length > 0);
    } else if (groupBy === 'ACTIVITY') {
      result = result.filter((t) =>
        t.stops?.some((s) => s.activities && s.activities.length > 0)
      );
    }

    // 4. Sort By
    result.sort((a, b) => {
      const startA = new Date(a.startDate).getTime();
      const startB = new Date(b.startDate).getTime();
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      const updatedA = new Date(a.updatedAt || a.createdAt || a.startDate).getTime();
      const updatedB = new Date(b.updatedAt || b.createdAt || b.startDate).getTime();

      switch (sortBy) {
        case 'date-asc':
          return startA - startB;
        case 'date-desc':
          return startB - startA;
        case 'title':
          return titleA.localeCompare(titleB);
        case 'recently-updated':
          return updatedB - updatedA;
        default:
          return startA - startB;
      }
    });

    return result;
  }, [trips, searchQuery, filterStatus, groupBy, sortBy]);

  // Derive stats for currently viewed month
  const activeMonthTrips = useMemo(() => {
    const m = currentDate.getMonth();
    const y = currentDate.getFullYear();
    const mStart = new Date(y, m, 1);
    const mEnd = new Date(y, m + 1, 0, 23, 59, 59);

    return filteredAndSortedTrips.filter((t) => {
      const s = new Date(t.startDate);
      const e = new Date(t.endDate);
      return s <= mEnd && e >= mStart;
    });
  }, [filteredAndSortedTrips, currentDate]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    groupBy !== 'ALL' ||
    filterStatus !== 'ALL' ||
    sortBy !== 'date-asc';

  return (
    <div className="calendar-page-container">
      {/* Ambient background glows */}
      <div className="cal-ambient-orb orb-1" />
      <div className="cal-ambient-orb orb-2" />

      {/* 1. Page Hero */}
      <section className="calendar-hero-section">
        <div className="cal-hero-inner">
          <div className="hero-badge-capsule">
            <Sparkles size={14} /> Schedule & Itineraries
          </div>
          <h1 className="calendar-page-title">Calendar</h1>
          <p className="calendar-page-subtitle">
            View your trips, activities, and important travel plans at a glance.
          </p>

          {/* Quick Metrics Bar */}
          {!loading && trips.length > 0 && (
            <div className="calendar-metrics-bar">
              <span className="cal-metric-pill">
                <strong>{trips.length}</strong> Total Trips
              </span>
              <span className="cal-metric-pill">
                <strong>{activeMonthTrips.length}</strong> Trips in Month
              </span>
              <span className="cal-metric-pill">
                <CalendarIcon size={13} /> {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="hero-cta-wrap">
          <Link to="/trips/create" className="btn-plan-trip-cta">
            <Plus size={18} />
            <span>Plan a Trip</span>
          </Link>
        </div>
      </section>

      {/* Main Calendar View Area */}
      <main className="calendar-main-content">
        {/* 2. Search / Group / Filter / Sort Toolbar */}
        <CalendarToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalTripsCount={trips.length}
          filteredCount={filteredAndSortedTrips.length}
        />

        {/* 3. Conditional States (Loading / Error / Empty / Grid) */}
        {loading ? (
          <div className="calendar-loading-card">
            <div className="spinner-navy" />
            <p>Loading your travel schedule...</p>
          </div>
        ) : error ? (
          <div className="calendar-error-card">
            <AlertCircle size={44} className="error-icon" />
            <h2>Unable to load your calendar.</h2>
            <p>{error}</p>
            <button type="button" className="btn-retry-trips" onClick={fetchTrips}>
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        ) : trips.length === 0 ? (
          /* Empty state when user has 0 trips */
          <div className="calendar-empty-card">
            <div className="empty-globe-icon-wrap">
              <Globe size={52} />
            </div>
            <h2>No trips planned yet.</h2>
            <p>Start planning your next adventure and your trips will appear here.</p>
            <Link to="/trips/create" className="btn-empty-create-trip">
              <Plus size={18} />
              <span>Plan a Trip</span>
            </Link>
          </div>
        ) : (
          /* Main Calendar Card with Navigation & View Toggle */
          <div className="calendar-interactive-card">
            <CalendarHeader
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onGoToToday={handleGoToToday}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              activeEventsCount={activeMonthTrips.length}
            />

            {/* Grid or Agenda View */}
            {viewMode === 'grid' ? (
              <CalendarGrid
                currentDate={currentDate}
                trips={filteredAndSortedTrips}
                onSelectTrip={(trip) => setSelectedTrip(trip)}
                onSelectDay={handleSelectDay}
                selectedDay={selectedDay}
              />
            ) : (
              <CalendarAgendaView
                trips={filteredAndSortedTrips}
                currentDate={currentDate}
                onSelectTrip={(trip) => setSelectedTrip(trip)}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. Event Details Drawer / Side Panel */}
      {selectedTrip && (
        <CalendarEventDrawer
          selectedTrip={selectedTrip}
          selectedDayData={selectedDayData}
          onClose={() => {
            setSelectedTrip(null);
            setSelectedDayData(null);
          }}
        />
      )}
    </div>
  );
}
