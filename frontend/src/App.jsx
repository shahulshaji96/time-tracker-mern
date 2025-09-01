import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Timesheets from './pages/Timesheets.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import HRPanel from './pages/HRPanel.jsx';
import { useAuth } from './hooks/useAuth.js';
import Button from './components/Shared/Button.jsx';

const RoleGuard = ({ roles, children }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Nav = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">
          ⏱️ Time & Payroll
        </Link>
        {user && <Link to="/timesheets">Timesheets</Link>}
        {user?.role === 'MANAGER' && <Link to="/manager">Manager</Link>}
        {user?.role === 'HR_ADMIN' && <Link to="/hr">HR</Link>}
      </div>
      <div className="nav-right">
        {!user && <Link to="/login">Login</Link>}
        {user && (
          <span className="user-pill">
            {user.name} • {user.role}
          </span>
        )}
        {user && (
          <Button onClick={logout} variant="secondary" size="sm">
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RoleGuard roles={['EMPLOYEE', 'MANAGER', 'HR_ADMIN']}>
                <Dashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/timesheets"
            element={
              <RoleGuard roles={['EMPLOYEE', 'MANAGER', 'HR_ADMIN']}>
                <Timesheets />
              </RoleGuard>
            }
          />
          <Route
            path="/manager"
            element={
              <RoleGuard roles={['MANAGER', 'HR_ADMIN']}>
                <ManagerDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/hr"
            element={
              <RoleGuard roles={['HR_ADMIN']}>
                <HRPanel />
              </RoleGuard>
            }
          />
          {/* catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
