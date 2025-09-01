import React, { useEffect, useState, useContext } from 'react';
import Button from '../Shared/Button.jsx';
import * as tsApi from '../../api/timesheet.js';
import { ToastContext } from '../../contexts/ToastContext.jsx';

export default function ClockInOut({ onUpdated }) {
  const [openShift, setOpenShift] = useState(null);
  const [geo, setGeo] = useState(null);
  const { notify } = useContext(ToastContext);

  useEffect(() => {
    (async () => {
      try {
        const items = await tsApi.myTimesheets({ limit: 1 });
        const active = items.find((ts) => !ts.clockOut) || null;
        setOpenShift(active);
      } catch (e) {
        notify('Failed to fetch current shift', 'error');
      }
    })();
  }, [notify]);

  const getGeo = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            source: 'browser',
          }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });

  const doClock = async (type) => {
    const coords = await getGeo();
    setGeo(coords);
    try {
      if (type === 'IN') {
        const ts = await tsApi.clockIn({ location: coords });
        setOpenShift(ts);
        notify('Clocked in', 'success');
        onUpdated?.(); // ✅ refresh parent timesheet list
      } else {
        await tsApi.clockOut({ location: coords });
        setOpenShift(null);
        notify('Clocked out', 'success');
        onUpdated?.(); // ✅ refresh parent timesheet list
      }
    } catch (e) {
      notify(e.message || 'Clock action failed', 'error');
    }
  };

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0 }}>Workday</h3>
          <small className="muted">
            {openShift ? 'Active shift running' : 'No active shift'}
          </small>
        </div>
        <div className="row">
          {!openShift && (
            <Button onClick={() => doClock('IN')}>Clock In</Button>
          )}
          {openShift && (
            <Button variant="danger" onClick={() => doClock('OUT')}>
              Clock Out
            </Button>
          )}
        </div>
      </div>
      {geo && (
        <small className="muted">
          Last location: {geo.lat?.toFixed(5)}, {geo.lng?.toFixed(5)}
        </small>
      )}
    </div>
  );
}
