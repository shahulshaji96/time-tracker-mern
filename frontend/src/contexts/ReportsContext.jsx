import React, { createContext, useContext, useState, useCallback } from 'react';
import * as payroll from '../api/payroll.js';
import { ToastContext } from './ToastContext.jsx';

const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const { notify } = useContext(ToastContext);
  const [rows, setRows] = useState([]);

  const loadReports = useCallback(async () => {
    try {
      const data = await payroll.getPayrollReport({
        from: '2024-01-01',
        to: '2025-12-31',
      });
      setRows(data);
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [notify]);

  return (
    <ReportsContext.Provider value={{ rows, loadReports }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportsContext);
}
