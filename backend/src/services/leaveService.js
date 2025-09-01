const LeaveRequest = require('../models/LeaveRequest');

async function createLeaveRequest({
  employeeId,
  type,
  startDate,
  endDate,
  reason,
}) {
  if (new Date(endDate) < new Date(startDate)) {
    throw new Error('End date cannot be before start date');
  }

  const leave = await LeaveRequest.create({
    employee: employeeId,
    type,
    startDate,
    endDate,
    reason,
  });

  return leave;
}

module.exports = {
  createLeaveRequest,
};
