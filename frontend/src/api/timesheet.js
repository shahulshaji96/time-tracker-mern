import { get, post } from './client.js';

export const clockIn = (payload) => post('/api/timesheets/clock-in', payload);
export const clockOut = (payload) => post('/api/timesheets/clock-out', payload);
export const myTimesheets = (params) => get('/api/timesheets/me', params); // ✅ simplified
export const pendingTimesheets = (params) =>
  get('/api/manager/team-timesheets', params);
export const approveTimesheet = (id, notes) =>
  post(`/api/manager/timesheet/${id}/approve`, { notes });
export const rejectTimesheet = (id, notes) =>
  post(`/api/manager/timesheet/${id}/reject`, { notes });
