const router = require('express').Router();
const managerController = require('../controllers/managerController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// Timesheets
router.get(
  '/team-timesheets',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.teamPending,
);
router.post(
  '/timesheet/:id/approve',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.approveTimesheet,
);
router.post(
  '/timesheet/:id/reject',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.rejectTimesheet,
);
router.post(
  '/leave/:id/approve',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.approveLeave,
);
router.post(
  '/leave/:id/reject',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.rejectLeave,
);

// Leaves
router.get(
  '/leaves',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.getTeamLeaves,
);

// Team Calendar
router.get(
  '/team-calendar',
  requireAuth,
  requireRole('MANAGER', 'HR_ADMIN'),
  managerController.getTeamCalendar,
);

module.exports = router;
