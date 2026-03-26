const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');
const apiRoutes = require('./routes'); // Automatically loads index.js

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Global Security & Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5000",
  credentials: true
}));

// DDoS Protection
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many API requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', globalLimiter);

// Core API Router
app.use('/api', apiRoutes);

// Serve Static Frontend Store
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;
