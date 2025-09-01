// routes/hrRoutes.js
const router = require('express').Router();
const hrController = require('../controllers/hrController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// Payroll
router.post(
  '/payroll/generate',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.generatePayroll,
);
router.get(
  '/payroll/:employeeId',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.getPayrollRecord,
);
router.get(
  '/reports/payroll',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.getPayrollReport,
); // ✅ ADDED

// Employees
router.post(
  '/employees',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.createEmployee,
);
router.put(
  '/employees/:id',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.editEmployee,
); // ✅ Edit
router.delete(
  '/employees/:id',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.deleteEmployee,
); // ✅ Delete
router.get(
  '/employees',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.listEmployees,
); // ✅ ADDED

// Reports
router.get(
  '/reports/attendance',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.getAttendanceReport,
);
router.get(
  '/reports/leave',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.getLeaveReport,
);
router.get(
  '/reports/payroll',
  requireAuth,
  requireRole('HR_ADMIN'),
  hrController.getPayrollReport,
);

module.exports = router;
