// 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// API routes
app.use('/api/auth', require('./routes/authRoutes'));


// Serve frontend
app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
  res.send('Fitmore API Running');
});

module.exports = app;
