import React, { useEffect, useState, useContext } from 'react';
import TimesheetList from '../components/Timesheet/TimesheetList.jsx';
import * as tsApi from '../api/timesheet.js';
import { ToastContext } from '../contexts/ToastContext.jsx';

export default function Timesheets() {
  const [items, setItems] = useState([]);
  const { notify } = useContext(ToastContext);

  const load = async () => {
    try {
      const res = await tsApi.myTimesheets({ limit: 100 });
      setItems(res || []);
    } catch (e) {
      notify(e.message || 'Failed to load timesheets', 'error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid">
      <h2>My Timesheets</h2>
      <TimesheetList items={items} />
    </div>
  );
}
