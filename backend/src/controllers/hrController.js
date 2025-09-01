const bcrypt = require('bcrypt');
const payrollService = require('../services/payrollService');
const LeaveRequest = require('../models/LeaveRequest');
const Timesheet = require('../models/Timesheet');
const User = require('../models/User');
const PayrollRecord = require('../models/PayrollRecord');

/**
 * Generate payroll for a specific employee & period
 */
exports.generatePayroll = async (req, res, next) => {
  try {
    const { employeeId, year, month } = req.body;
    const payroll = await payrollService.generatePayrollFor(
      employeeId,
      Number(year),
      Number(month),
    );
    res.json(payroll);
  } catch (err) {
    next(err); // centralized error handler
  }
};

/**
 * Fetch leave report (with optional date range filter)
 */
exports.getLeaveReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from && to) {
      query.startDate = { $gte: new Date(from) };
      query.endDate = { $lte: new Date(to) };
    }

    const leaves = await LeaveRequest.find(query).populate(
      'employee',
      'name email',
    );

    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leave report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Fetch attendance report (with optional date range filter)
 */
exports.getAttendanceReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from && to) {
      query.clockIn = { $gte: new Date(from), $lte: new Date(to) };
    }

    const timesheets = await Timesheet.find(query).populate(
      'employee',
      'name email',
    );

    res.json(timesheets);
  } catch (err) {
    console.error('Error fetching attendance report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Create a new employee (User)
 */
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, role, hourlyRate, password } = req.body;

    // If HR doesn’t send a password, set a default one
    const plainPassword = password || 'Welcome123';
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = new User({ name, email, role, hourlyRate, passwordHash });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update employee details (edit)
 */
exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error editing employee:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete employee
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Fetch payroll records of an employee
 */
exports.getPayrollRecord = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const records = await PayrollRecord.find({ employee: employeeId }).sort({
      createdAt: -1,
    });

    res.json(records);
  } catch (err) {
    console.error('Error fetching payroll record:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Payroll report for all employees in range
 */
exports.getPayrollReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from || to) {
      query.generatedAt = {};
      if (from) query.generatedAt.$gte = new Date(from);
      if (to) query.generatedAt.$lte = new Date(to);
    }

    const records = await PayrollRecord.find(query).populate(
      'employee',
      'name',
    );
    const formatted = records.map((r) => ({
      employeeName: r.employee?.name || 'Unknown',
      period: `${r.year}-${String(r.month).padStart(2, '0')}`,
      regularHours: r.regularHours,
      overtimeHours: r.overtimeHours,
      grossPay: r.grossPay,
      netPay: r.netPay,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching payroll report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * List employees
 */
exports.listEmployees = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
