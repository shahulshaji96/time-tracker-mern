const LeaveRequest = require('../models/LeaveRequest');
const leaveService = require('../services/leaveService');
const User = require('../models/User');

// GET /api/leave/me
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user._id || req.user.sub; // handle both cases
    const leaves = await LeaveRequest.find({ employee: userId }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching my leaves:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/manager/leaves?status=PENDING
exports.getManagerLeaves = async (req, res) => {
  try {
    // Ensure the user is a manager
    const currentUser = await User.findById(req.user.sub);
    if (currentUser.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Get all leave requests that are pending approval (or match query)
    const leaves = await LeaveRequest.find(query)
      .populate('employee', 'name email') // show employee details
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error('Error fetching manager leaves:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.requestLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const employeeId = req.user._id;

    const leave = await leaveService.createLeaveRequest({
      employeeId,
      type,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ leave });
  } catch (err) {
    next(err);
  }
};
