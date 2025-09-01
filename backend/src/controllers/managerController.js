const mongoose = require('mongoose');
const Timesheet = require('../models/Timesheet');
const LeaveRequest = require('../models/LeaveRequest');

// ✅ Utility function
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Manager view of all pending timesheets
 * (💡 TODO: filter by manager’s team in production)
 */
exports.teamPending = async (req, res, next) => {
  try {
    const list = await Timesheet.find({ status: 'PENDING' }).populate(
      'employee',
      'name email',
    );
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * Approve a timesheet
 */
exports.approveTimesheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const approver = req.user;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid timesheet ID' });
    }

    const ts = await Timesheet.findById(id);
    if (!ts) return res.status(404).json({ error: 'Timesheet not found' });

    ts.status = 'APPROVED';
    ts.approvedBy = approver._id;
    ts.approvedAt = new Date();

    await ts.save();
    res.json(ts);
  } catch (err) {
    next(err);
  }
};

/**
 * Reject a timesheet
 */
exports.rejectTimesheet = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid timesheet ID' });
    }

    const ts = await Timesheet.findById(id);
    if (!ts) return res.status(404).json({ error: 'Timesheet not found' });

    ts.status = 'REJECTED';
    ts.rejectedAt = new Date();

    await ts.save();
    res.json(ts);
  } catch (err) {
    next(err);
  }
};

/**
 * Approve a leave request
 */
exports.approveLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const approver = req.user;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid leave ID' });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = 'APPROVED';
    leave.approver = approver._id;
    leave.approvedAt = new Date();

    await leave.save();
    res.json(leave);
  } catch (err) {
    next(err);
  }
};

/**
 * Reject a leave request
 */
exports.rejectLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const approver = req.user;
    const { notes } = req.body; // optional rejection notes

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid leave ID' });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = 'REJECTED';
    leave.approver = approver._id;
    leave.approverNotes = notes || '';
    leave.rejectedAt = new Date();

    await leave.save();
    res.json(leave);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all leave requests for manager’s team
 */
exports.getTeamLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const leaves = await LeaveRequest.find(query).populate(
      'employee',
      'name email',
    );

    res.json(leaves);
  } catch (err) {
    console.error('Error fetching team leaves:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get team calendar (leaves + timesheets)
 */
exports.getTeamCalendar = async (req, res) => {
  try {
    const { status } = req.query;

    const [leaves, timesheets] = await Promise.all([
      LeaveRequest.find(status ? { status } : {}).populate(
        'employee',
        'name email',
      ),
      Timesheet.find().populate('employee', 'name email'),
    ]);

    res.json({ leaves, timesheets });
  } catch (err) {
    console.error('Error fetching team calendar:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
