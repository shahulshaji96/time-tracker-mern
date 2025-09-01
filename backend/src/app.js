const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const managerRoutes = require('./routes/managerRoutes');
const hrRoutes = require('./routes/hrRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/leave', leaveRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

module.exports = app;
