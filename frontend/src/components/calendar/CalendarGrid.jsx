import React from 'react';
import { MapPin, Sparkles, Plus, Clock } from 'lucide-react';
import { getTripStatus } from '../trips/TripListingCard';

export function CalendarGrid({
  currentDate,
  trips,
  onSelectTrip,
  onSelectDay,
  selectedDay,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingWeekday = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const today = new Date();
  const isTodayDate = (d, m, y) => {
    return (
      today.getDate() === d &&
      today.getMonth() === m &&
      today.getFullYear() === y
    );
  };

  const isSelectedDate = (d, m, y) => {
    if (!selectedDay) return false;
    return (
      selectedDay.getDate() === d &&
      selectedDay.getMonth() === m &&
      selectedDay.getFullYear() === y
    );
  };

  // Helper to test if a trip covers a particular day
  const getTripsForDate = (dateObj) => {
    const targetTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();

    return trips.filter((trip) => {
      if (!trip.startDate || !trip.endDate) return false;
      const s = new Date(trip.startDate);
      const start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      const e = new Date(trip.endDate);
      const end = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();

      return targetTime >= start && targetTime <= end;
    });
  };

  // Helper to test if any activity is scheduled on a particular day
  const getActivitiesForDate = (dateObj) => {
    const targetTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
    const matches = [];

    trips.forEach((trip) => {
      trip.stops?.forEach((stop) => {
        stop.activities?.forEach((act) => {
          if (act.scheduledDate) {
            const actDate = new Date(act.scheduledDate);
            const aTime = new Date(actDate.getFullYear(), actDate.getMonth(), actDate.getDate()).getTime();
            if (aTime === targetTime) {
              matches.push({
                ...act,
                tripTitle: trip.title,
                tripId: trip.id,
                cityName: stop.city?.name,
              });
            }
          }
        });
      });
    });

    return matches;
  };

  // Construct array of calendar cells
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = startingWeekday - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateObj = new Date(prevYear, prevMonthIdx, dayNum);

    calendarCells.push({
      day: dayNum,
      month: prevMonthIdx,
      year: prevYear,
      isCurrentMonth: false,
      dateObj,
      trips: getTripsForDate(dateObj),
      activities: getActivitiesForDate(dateObj),
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    calendarCells.push({
      day: d,
      month,
      year,
      isCurrentMonth: true,
      dateObj,
      trips: getTripsForDate(dateObj),
      activities: getActivitiesForDate(dateObj),
    });
  }

  // 3. Next month leading days to complete full weeks
  const totalCellsCount = calendarCells.length;
  const remainingCells = (7 - (totalCellsCount % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateObj = new Date(nextYear, nextMonthIdx, d);

    calendarCells.push({
      day: d,
      month: nextMonthIdx,
      year: nextYear,
      isCurrentMonth: false,
      dateObj,
      trips: getTripsForDate(dateObj),
      activities: getActivitiesForDate(dateObj),
    });
  }

  return (
    <div className="calendar-grid-wrapper" role="grid" aria-label="Monthly Calendar View">
      {/* Weekday headers */}
      <div className="calendar-weekdays-row" role="row">
        {weekdays.map((wd) => (
          <div key={wd} className="calendar-weekday-header" role="columnheader">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="calendar-days-grid">
        {calendarCells.map((cell, idx) => {
          const isToday = isTodayDate(cell.day, cell.month, cell.year);
          const isSelected = isSelectedDate(cell.day, cell.month, cell.year);
          const hasTrips = cell.trips.length > 0;
          const hasActivities = cell.activities.length > 0;

          return (
            <div
              key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
              className={`calendar-day-cell ${cell.isCurrentMonth ? 'in-month' : 'out-month'} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${hasTrips ? 'has-trips' : ''}`}
              onClick={() => onSelectDay(cell.dateObj, cell)}
              role="gridcell"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectDay(cell.dateObj, cell);
              }}
              aria-label={`${cell.day} ${cell.isCurrentMonth ? '' : '(other month)'}`}
            >
              {/* Day header number and badge */}
              <div className="day-cell-top">
                <span className={`day-number ${isToday ? 'today-pill' : ''}`}>
                  {cell.day}
                </span>

                {isToday && (
                  <span className="today-text-tag">Today</span>
                )}
              </div>

              {/* Day Events Stack */}
              <div className="day-events-stack">
                {/* Trips */}
                {cell.trips.slice(0, 2).map((trip) => {
                  const status = getTripStatus(trip.startDate, trip.endDate);
                  const isStart =
                    new Date(trip.startDate).toDateString() === cell.dateObj.toDateString();
                  const isEnd =
                    new Date(trip.endDate).toDateString() === cell.dateObj.toDateString();

                  return (
                    <div
                      key={trip.id}
                      className={`calendar-trip-chip status-${status.toLowerCase()} ${isStart ? 'chip-start' : ''} ${isEnd ? 'chip-end' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrip(trip);
                      }}
                      title={`${trip.title} (${status})`}
                    >
                      <span className="chip-text">{trip.title}</span>
                    </div>
                  );
                })}

                {/* More trips counter */}
                {cell.trips.length > 2 && (
                  <div className="chip-more-counter">
                    +{cell.trips.length - 2} more trips
                  </div>
                )}

                {/* Scheduled Activities Indicators */}
                {hasActivities && (
                  <div className="day-activities-summary" title={`${cell.activities.length} activity scheduled`}>
                    <span className="act-dot" />
                    <span className="act-text">
                      {cell.activities[0].customName || cell.activities[0].activity?.name || 'Activity'}
                      {cell.activities.length > 1 && ` (+${cell.activities.length - 1})`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
