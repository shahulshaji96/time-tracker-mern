const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date },
  location: {
    lat: Number,
    lng: Number,
    source: String,
  },
  notes: String,
  durationMinutes: Number,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

// ✅ compute duration automatically
TimesheetSchema.pre('save', function (next) {
  if (this.clockIn && this.clockOut) {
    this.durationMinutes = Math.round((this.clockOut - this.clockIn) / 60000);
  }
  next();
});

module.exports = mongoose.model('Timesheet', TimesheetSchema);
