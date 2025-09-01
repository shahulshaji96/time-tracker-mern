import React, { useState } from 'react';
import PayrollGenerator from '../components/HR/PayrollGenerator.jsx';
import EmployeeManagement from '../components/HR/EmployeeManagement.jsx';
import Reports from '../components/HR/Reports.jsx';

export default function HRDashboard() {
  // state to trigger report refresh
  const [refreshKey, setRefreshKey] = useState(0);

  // callback to increment refreshKey after payroll generation
  const handlePayrollGenerated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="grid gap-lg">
      <EmployeeManagement />
      {/* pass the callback to PayrollGenerator */}
      <PayrollGenerator onGenerated={handlePayrollGenerated} />
      {/* pass refreshKey to Reports */}
      <Reports refreshKey={refreshKey} />
    </div>
  );
}
