const Timesheet = require('../models/Timesheet');
const { diffInMinutes } = require('../utils/dateUtils');

async function clockIn(employeeId, location) {
  // check if already clocked in
  const open = await Timesheet.findOne({
    employee: employeeId,
    clockOut: null,
  });
  if (open) throw new Error('Already clocked in');

  const ts = await Timesheet.create({
    employee: employeeId,
    clockIn: new Date(),
    location,
    status: 'PENDING',
  });
  return ts;
}

async function clockOut(employeeId, location) {
  const ts = await Timesheet.findOne({ employee: employeeId, clockOut: null });
  if (!ts) throw new Error(`No open shift found for employee ${employeeId}`);

  ts.clockOut = new Date();
  ts.durationMinutes = diffInMinutes(ts.clockIn, ts.clockOut);
  ts.status = 'PENDING'; // stays pending until approval
  ts.location = location || ts.location;
  await ts.save();
  return ts;
}

async function listForEmployee(employeeId, { limit = 200, status } = {}) {
  const filter = { employee: employeeId };

  // ✅ add support for open shifts (no clockOut yet)
  if (status === 'OPEN') {
    filter.clockOut = null;
  } else if (status) {
    filter.status = status;
  }

  return Timesheet.find(filter).sort({ clockIn: -1 }).limit(Number(limit));
}

module.exports = { clockIn, clockOut, listForEmployee };
