const timesheetService = require('../services/timesheetService');

async function clockIn(req, res, next) {
  try {
    const loc = req.body.location || req.body.coords || null;
    const ts = await timesheetService.clockIn(req.user._id, loc);
    res.status(201).json(ts);
  } catch (err) {
    next(err);
  }
}

async function clockOut(req, res, next) {
  try {
    const loc = req.body.location || req.body.coords || null;
    const ts = await timesheetService.clockOut(req.user._id, loc);
    res.json(ts);
  } catch (err) {
    next(err);
  }
}

async function myTimesheets(req, res, next) {
  try {
    // ✅ pass query params like limit & status into service
    const data = await timesheetService.listForEmployee(
      req.user._id,
      req.query,
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { clockIn, clockOut, myTimesheets };
