const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  hsts: false
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ✅ FIXED CORS (IMPORTANT for EC2)
app.use(cors({
  origin: "*",
  credentials: true
}));

// ✅ Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', apiRoutes);

// ✅ Home route MUST be before express.static
// ✅ Home route FIRST
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/user/index.html'));
});

// ✅ Static files
app.use(express.static(path.join(__dirname, './public')));

// ✅ THEN define route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/user/index.html'));
// });

module.exports = app;