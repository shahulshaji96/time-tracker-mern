import React, { useEffect, useState, useContext } from 'react';
import ClockInOut from '../components/Timesheet/ClockInOut.jsx';
import * as tsApi from '../api/timesheet.js';
import TimesheetList from '../components/Timesheet/TimesheetList.jsx';
import LeaveRequestForm from '../components/Timesheet/LeaveRequestForm.jsx';
import { ToastContext } from '../contexts/ToastContext.jsx';

export default function Dashboard() {
  const [recent, setRecent] = useState([]);
  const { notify } = useContext(ToastContext);

  // function to load recent timesheets
  const load = async () => {
    try {
      const items = await tsApi.myTimesheets({ limit: 10 });
      setRecent(items);
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid cols-2">
      <div className="grid" style={{ alignContent: 'start' }}>
        {/* pass load callback to refresh after clock in/out */}
        <ClockInOut onUpdated={load} />
        <LeaveRequestForm onSubmitted={load} />
      </div>
      <div>
        <h3>Recent Timesheets</h3>
        <TimesheetList items={recent} />
      </div>
    </div>
  );
}
