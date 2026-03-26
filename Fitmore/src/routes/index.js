const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const adminDashboardRoutes = require('./adminDashboardRoutes');
const adminReviewRoutes = require('./adminReviewRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');
const contactRoutes = require('./contactRoutes');
const paymentRoutes = require('./paymentRoutes');
const brandRoutes = require('./brandRoutes');

// Public & Auth
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);

// Users
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);

// Catalog
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

// Admin
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/admin/reviews', adminReviewRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
