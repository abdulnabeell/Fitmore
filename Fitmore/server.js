require('dotenv').config();
const app = require('./src/app');
const cookieParser = require('cookie-parser');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require("./src/routes/orderRoutes");
const adminDashboardRoutes = require('./src/routes/adminDashboardRoutes');
const adminReviewRoutes = require('./src/routes/adminReviewRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const express = require('express');
const cors = require('cors');

app.use(cookieParser());
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use(
  "/api/admin",
  require("./src/routes/adminDashboardRoutes")
);
app.use("/api/orders", orderRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);

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