import React, { useEffect, useState, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { ToastContext } from '../../contexts/ToastContext.jsx';
import * as tsApi from '../../api/timesheet.js';
import * as leaveApi from '../../api/leave.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO } from 'date-fns';

export default function TeamCalendar() {
  const { notify } = useContext(ToastContext);
  const [events, setEvents] = useState([]);

  const loadCalendar = async () => {
    try {
      const [leaves, times] = await Promise.all([
        leaveApi.pendingLeaves({ status: 'APPROVED' }),
        tsApi.pendingTimesheets({ status: 'APPROVED' }),
      ]);

      const mappedEvents = [
        ...leaves.map((l) => ({
          id: l._id,
          title: `${l.employee?.name || '—'} • Leave`,
          start: parseISO(l.startDate),
          end: parseISO(l.endDate),
          type: 'Leave',
          reason: l.reason,
        })),
        ...times.map((t) => ({
          id: t._id,
          title: `${t.employee?.name || '—'} • Work`,
          start: parseISO(t.clockIn),
          end: parseISO(t.clockOut),
          type: 'Work',
          hours: t.durationMinutes ? (t.durationMinutes / 60).toFixed(2) : '—',
        })),
      ];

      setEvents(mappedEvents);
    } catch (e) {
      notify(e.message || 'Failed to load calendar', 'error');
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  // Event colors
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.type === 'Leave' ? '#f59e0b' : '#3b82f6', // amber for leave, blue for work
      color: '#111', // dark text for contrast
      borderRadius: 4,
      padding: '2px 4px',
      border: '1px solid #fff',
      fontWeight: 500,
    };
    return { style };
  };

  const onSelectEvent = (event) => {
    if (window.confirm(`Remove ${event.type} for ${event.title}?`)) {
      const apiCall =
        event.type === 'Leave' ? leaveApi.rejectLeave : tsApi.rejectTimesheet;
      apiCall(event.id)
        .then(() => {
          notify(`${event.type} removed`, 'success');
          loadCalendar();
        })
        .catch((err) => notify(err.message, 'error'));
    }
  };

  const localizer = momentLocalizer(moment);

  return (
    <div
      className="card"
      style={{ backgroundColor: '#1f1f1f', color: '#f5f5f5' }}
    >
      <h3 style={{ marginTop: 0, color: '#f5f5f5' }}>Team Calendar</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, backgroundColor: '#111', color: '#f5f5f5' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onSelectEvent}
        views={['month', 'week', 'day']}
        dayPropGetter={() => ({
          style: { backgroundColor: '#1f1f1f', color: '#f5f5f5' },
        })}
        toolbarAccessor={() => ({ style: { color: '#f5f5f5' } })}
      />
    </div>
  );
}
