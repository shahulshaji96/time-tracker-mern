import { get, post, put, del } from './client.js';
export const listEmployees = () => get('/api/hr/employees');
export const createEmployee = (payload) => post('/api/hr/employees', payload);
export const updateEmployee = (id, payload) =>
  put(`/api/hr/employees/${id}`, payload);
export const deleteEmployee = (id) => del(`/api/hr/employees/${id}`);
