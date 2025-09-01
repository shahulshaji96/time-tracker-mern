import React from 'react';
import Table from '../Shared/Table.jsx';
import { format } from 'date-fns';

export default function TimesheetList({ items }) {
  const columns = [
    {
      header: 'Date',
      render: (r) =>
        r.clockIn ? format(new Date(r.clockIn), 'yyyy-MM-dd') : '—',
    },
    {
      header: 'Clock In',
      render: (r) => (r.clockIn ? format(new Date(r.clockIn), 'HH:mm') : '—'),
    },
    {
      header: 'Clock Out',
      render: (r) => (r.clockOut ? format(new Date(r.clockOut), 'HH:mm') : '—'),
    },
    {
      header: 'Duration',
      render: (r) => {
        if (r.durationMinutes) return `${Math.round(r.durationMinutes)}m`;
        if (r.clockIn && r.clockOut) {
          const diff = (new Date(r.clockOut) - new Date(r.clockIn)) / 60000;
          return `${Math.round(diff)}m`;
        }
        return '—';
      },
    },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status?.toLowerCase()}`}>{r.status}</span>
      ),
    },
    { header: 'Notes', key: 'notes' },
  ];
  return (
    <div className="card">
      <Table columns={columns} data={items} getRowKey={(r) => r.id || r._id} />
    </div>
  );
}
