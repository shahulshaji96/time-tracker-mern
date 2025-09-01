import React, { useState, useContext, useEffect } from 'react';
import Input from '../Shared/Input.jsx';
import Button from '../Shared/Button.jsx';
import * as payrollApi from '../../api/payroll.js';
import * as empApi from '../../api/employee.js';
import { ToastContext } from '../../contexts/ToastContext.jsx';

export default function PayrollGenerator({ onGenerated }) {
  const { notify } = useContext(ToastContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    empApi
      .listEmployees()
      .then(setEmployees)
      .catch((e) => notify(e.message, 'error'));
  }, []);

  const run = async () => {
    if (!employeeId) {
      notify('Please select an employee', 'error');
      return;
    }
    setLoading(true);
    try {
      await payrollApi.generatePayroll({ employeeId, year, month });
      notify('Payroll generated', 'success');
      onGenerated && onGenerated();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Payroll Processing</h3>
      <div className="grid cols-3 gap-sm">
        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(+e.target.value)}
        />
        <Input
          label="Month"
          type="number"
          value={month}
          onChange={(e) => setMonth(+e.target.value)}
        />
        <label className="stack">
          <span className="muted">Employee</span>
          <select
            className="select"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <Button onClick={run} disabled={loading}>
          {loading ? 'Processing…' : 'Run Payroll'}
        </Button>
      </div>
    </div>
  );
}
