const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  year: Number,
  month: Number,
  regularHours: Number,
  overtimeHours: Number,
  grossPay: Number,
  deductions: Number,
  netPay: Number,
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PayrollRecord', PayrollSchema);
