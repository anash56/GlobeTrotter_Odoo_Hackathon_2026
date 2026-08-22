import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Grid3X3, Sparkles } from 'lucide-react';

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  viewMode,
  onViewModeChange,
  activeEventsCount
}) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const isCurrentMonthToday = () => {
    const today = new Date();
    return (
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="calendar-header-card">
      <div className="calendar-header-nav">
        {/* Previous Month */}
        <button
          type="button"
          className="btn-cal-nav"
          onClick={onPrevMonth}
          aria-label="Previous Month"
          title="Previous Month"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Current Month & Year Display */}
        <div className="calendar-month-title-wrap">
          <h2 className="calendar-month-title">
            {currentMonthName} <span className="year-accent">{currentYear}</span>
          </h2>
          {activeEventsCount > 0 && (
            <span className="cal-active-badge">
              <Sparkles size={12} /> {activeEventsCount} {activeEventsCount === 1 ? 'Trip' : 'Trips'} this month
            </span>
          )}
        </div>

        {/* Next Month */}
        <button
          type="button"
          className="btn-cal-nav"
          onClick={onNextMonth}
          aria-label="Next Month"
          title="Next Month"
        >
          <ChevronRight size={20} />
        </button>

        {/* Jump to Today Button */}
        <button
          type="button"
          className={`btn-cal-today ${isCurrentMonthToday() ? 'active' : ''}`}
          onClick={onGoToToday}
        >
          <CalendarIcon size={14} />
          <span>Today</span>
        </button>
      </div>

      {/* View Mode Toggle: Grid vs Agenda List */}
      <div className="calendar-view-toggle">
        <button
          type="button"
          className={`btn-view-mode ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => onViewModeChange('grid')}
          title="Month Grid View"
        >
          <Grid3X3 size={15} />
          <span>Grid</span>
        </button>
        <button
          type="button"
          className={`btn-view-mode ${viewMode === 'agenda' ? 'active' : ''}`}
          onClick={() => onViewModeChange('agenda')}
          title="Agenda Schedule View"
        >
          <List size={15} />
          <span>Agenda</span>
        </button>
      </div>
    </div>
  );
}
