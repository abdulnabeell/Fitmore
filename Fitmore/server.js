require('dotenv').config();
const app = require('./src/app');
const cookieParser = require('cookie-parser');
const productRoutes = require('./src/routes/productRoutes');
const express = require('express');
const cors = require('cors');

app.use(cookieParser());
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.use('/api/user', require('./src/routes/userRoutes'));

app.use('/api/auth', require('./src/routes/authRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// require('dotenv').config();

// const app = require('./src/app');
// const cookieParser = require('cookie-parser');
// const express = require('express');
// const cors = require('cors');

// const productRoutes = require('./src/routes/productRoutes');

// // ✅ Middlewares FIRST
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());

// // ✅ Routes AFTER middleware
// app.use('/api/admin', require('./src/routes/adminRoutes'));
// app.use('/api/categories', require('./src/routes/categoryRoutes'));
// app.use('/api/products', productRoutes);
// app.use('/api/user', require('./src/routes/userRoutes'));
// app.use('/api/auth', require('./src/routes/authRoutes'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });