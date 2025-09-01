import { get, post } from './client.js';
export const requestLeave = (payload) => post('/api/leave/request', payload);
export const myLeaves = () => get('/api/leave/me');
export const pendingLeaves = (params) => get('/api/manager/leaves', params);
export const approveLeave = (id, notes) =>
  post(`/api/manager/leave/${id}/approve`, { notes });
export const rejectLeave = (id, notes) =>
  post(`/api/manager/leave/${id}/reject`, { notes });
