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

// Allow multiple origins or dynamically allow the request origin
const allowedOrigins = [
  'http://localhost:5173',          // local dev
  'https://time-tracker-mern.vercel.app',  // frontend on Render
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/leave', leaveRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

module.exports = app;
