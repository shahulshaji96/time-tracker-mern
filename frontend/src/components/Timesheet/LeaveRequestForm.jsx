import React, { useState, useContext } from 'react';
import Input from '../Shared/Input.jsx';
import Button from '../Shared/Button.jsx';
import * as leaveApi from '../../api/leave.js';
import { ToastContext } from '../../contexts/ToastContext.jsx';

export default function LeaveRequestForm({ onSubmitted }) {
  const [type, setType] = useState('VACATION');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const { notify } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      notify('End date cannot be before start date', 'error');
      return;
    }

    setLoading(true);
    try {
      await leaveApi.requestLeave({ type, startDate, endDate, reason });
      notify('Leave requested', 'success');
      onSubmitted?.();
      setType('VACATION');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (e) {
      notify(e.message || 'Failed to submit leave request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h3 style={{ marginTop: 0 }}>Request Time Off</h3>
      <div className="grid cols-3">
        <label className="stack">
          <span className="muted">Type</span>
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="VACATION">Vacation</option>
            <option value="SICK">Sick</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </label>
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <label className="stack" style={{ marginTop: 8 }}>
        <span className="muted">Reason</span>
        <textarea
          className="textarea"
          name="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      <div style={{ marginTop: 12 }}>
        <Button disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
