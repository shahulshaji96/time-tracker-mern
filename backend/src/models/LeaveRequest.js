const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['SICK', 'VACATION', 'UNPAID', 'OTHER'],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: String,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approverNotes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LeaveRequest', LeaveSchema);
