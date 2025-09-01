import React, { useEffect, useState, useContext } from 'react';
import Table from '../Shared/Table.jsx';
import Button from '../Shared/Button.jsx';
import * as tsApi from '../../api/timesheet.js';
import * as leaveApi from '../../api/leave.js';
import { ToastContext } from '../../contexts/ToastContext.jsx';

function ActionButtons({ id, onApprove, onReject }) {
  return (
    <div className="row" style={{ gap: '8px' }}>
      <Button size="sm" onClick={() => onApprove(id)}>
        Approve
      </Button>
      <Button size="sm" variant="danger" onClick={() => onReject(id)}>
        Reject
      </Button>
    </div>
  );
}

export default function PendingApprovals() {
  const [timesheets, setTimesheets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const { notify } = useContext(ToastContext);

  const load = async () => {
    try {
      const [ts, lv] = await Promise.all([
        tsApi.pendingTimesheets({ status: 'PENDING' }),
        leaveApi.pendingLeaves({ status: 'PENDING' }),
      ]);
      setTimesheets(ts || []);
      setLeaves(lv || []);
    } catch (e) {
      notify(e.message || 'Failed to load pending items', 'error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approveTS = async (id) => {
    await tsApi.approveTimesheet(id);
    notify('Timesheet approved', 'success');
    load();
  };
  const rejectTS = async (id) => {
    await tsApi.rejectTimesheet(id);
    notify('Timesheet rejected', 'success');
    load();
  };
  const approveLV = async (id) => {
    await leaveApi.approveLeave(id);
    notify('Leave approved', 'success');
    load();
  };
  const rejectLV = async (id) => {
    await leaveApi.rejectLeave(id);
    notify('Leave rejected', 'success');
    load();
  };

  const tsCols = [
    { header: 'Employee', render: (r) => r.employee?.name || '—' },
    {
      header: 'Date',
      render: (r) =>
        r.clockIn ? new Date(r.clockIn).toLocaleDateString() : '—',
    },
    {
      header: 'Hours',
      render: (r) =>
        r.clockIn && r.clockOut
          ? ((new Date(r.clockOut) - new Date(r.clockIn)) / 3600000).toFixed(2)
          : '—',
    },
    { header: 'Notes', key: 'notes' },
    {
      header: 'Action',
      render: (r) => (
        <ActionButtons id={r._id} onApprove={approveTS} onReject={rejectTS} />
      ),
    },
  ];

  const lvCols = [
    { header: 'Employee', render: (r) => r.employee?.name || '—' },
    { header: 'Type', key: 'type' },
    {
      header: 'From',
      render: (r) =>
        r.startDate ? new Date(r.startDate).toLocaleDateString() : '—',
    },
    {
      header: 'To',
      render: (r) =>
        r.endDate ? new Date(r.endDate).toLocaleDateString() : '—',
    },
    { header: 'Reason', key: 'reason' },
    {
      header: 'Action',
      render: (r) => (
        <ActionButtons id={r._id} onApprove={approveLV} onReject={rejectLV} />
      ),
    },
  ];

  return (
    <div className="stack" style={{ gap: '24px' }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pending Timesheets</h3>
        <Table columns={tsCols} data={timesheets} getRowKey={(r) => r._id} />
        {!timesheets.length && <em>No pending timesheets</em>}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pending Leaves</h3>
        <Table columns={lvCols} data={leaves} getRowKey={(r) => r._id} />
        {!leaves.length && <em>No pending leaves</em>}
      </div>
    </div>
  );
}
