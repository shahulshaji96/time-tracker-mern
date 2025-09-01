const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { requireAuth } = require('../middlewares/authMiddleware');

// POST /api/leave/request
router.post('/request', requireAuth, leaveController.requestLeave);
// GET /api/leave/me → employee's own leave requests
router.get('/me', requireAuth, leaveController.getMyLeaves);

// GET /api/manager/leaves?status=PENDING → manager pending approvals
router.get('/manager/leaves', requireAuth, leaveController.getManagerLeaves);

module.exports = router;
