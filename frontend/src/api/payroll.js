import { get, post } from './client.js';
export const generatePayroll = (payload) =>
  post('/api/hr/payroll/generate', payload);
export const getPayrollForEmployee = (employeeId, params) =>
  get(`/api/hr/payroll/${employeeId}`, { params });
export const getPayrollReport = (params) =>
  get('/api/hr/reports/payroll', { params });
