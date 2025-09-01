const Timesheet = require('../models/Timesheet');
const Payroll = require('../models/PayrollRecord');
const User = require('../models/User');
const mongoose = require('mongoose');

async function generatePayrollFor(employeeRef, year, month) {
  let user;

  // Allow both id and name
  if (mongoose.Types.ObjectId.isValid(employeeRef)) {
    user = await User.findById(employeeRef);
  } else {
    user = await User.findOne({ name: employeeRef });
  }

  if (!user) throw new Error('User not found');

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const timesheets = await Timesheet.find({
    employee: user._id,
    status: 'APPROVED',
    clockIn: { $gte: start, $lt: end },
  });

  let totalMinutes = 0;
  timesheets.forEach((t) => (totalMinutes += t.durationMinutes || 0));

  const totalHours = totalMinutes / 60;
  const regularHours = Math.min(totalHours, 160);
  const overtimeHours = Math.max(0, totalHours - 160);
  const grossPay =
    regularHours * user.hourlyRate + overtimeHours * user.hourlyRate * 1.5;
  const deductions = 0;
  const netPay = grossPay - deductions;

  const payroll = await Payroll.create({
    employee: user._id,
    year,
    month,
    regularHours,
    overtimeHours,
    grossPay,
    deductions,
    netPay,
  });

  return payroll;
}

module.exports = { generatePayrollFor };
