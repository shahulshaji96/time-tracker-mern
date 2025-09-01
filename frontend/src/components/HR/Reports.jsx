import React, { useEffect, useState, useContext } from 'react';
import Table from '../Shared/Table.jsx';
import Button from '../Shared/Button.jsx';
import { ToastContext } from '../../contexts/ToastContext.jsx';
import * as payroll from '../../api/payroll.js';

// Accept refreshKey as a prop
export default function Reports({ refreshKey }) {
  const { notify } = useContext(ToastContext);
  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      const data = await payroll.getPayrollReport({
        from: '2024-01-01',
        to: '2025-12-31',
      });
      setRows(data);
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  // Reload whenever refreshKey changes
  useEffect(() => {
    load();
  }, [refreshKey]);

  const exportCsv = () => {
    const header = [
      'Employee',
      'Period',
      'Regular Hours',
      'Overtime',
      'Gross',
      'Net',
    ];
    const csv = [header.join(',')]
      .concat(
        rows.map((r) =>
          [
            r.employeeName,
            r.period,
            r.regularHours,
            r.overtimeHours,
            r.grossPay,
            r.netPay,
          ].join(',')
        )
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payroll_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { header: 'Employee', key: 'employeeName' },
    { header: 'Period', key: 'period' },
    { header: 'Regular Hours', key: 'regularHours' },
    { header: 'Overtime', key: 'overtimeHours' },
    { header: 'Gross', key: 'grossPay' },
    { header: 'Net', key: 'netPay' },
  ];

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>Payroll Reports</h3>
        <Button onClick={exportCsv}>Export CSV</Button>
      </div>
      <Table columns={columns} data={rows} getRowKey={(r, i) => i} />
    </div>
  );
}
