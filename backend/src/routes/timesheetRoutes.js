const router = require('express').Router();
const timesheetController = require('../controllers/timesheetController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/clock-in', requireAuth, timesheetController.clockIn);
router.post('/clock-out', requireAuth, timesheetController.clockOut);
router.get('/me', requireAuth, timesheetController.myTimesheets);

module.exports = router;
