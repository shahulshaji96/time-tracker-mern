import React from 'react';
import PendingApprovals from '../components/Manager/PendingApprovals.jsx';
import TeamCalendar from '../components/Manager/TeamCalendar.jsx';

export default function ManagerDashboard() {
  return (
    <div className="stack" style={{ gap: '24px', alignItems: 'stretch' }}>
      {/* Pending approvals (timesheets + leaves stacked inside) */}
      <PendingApprovals />

      {/* Team calendar */}
      <TeamCalendar />
    </div>
  );
}
