const express = require('express');
const router = express.Router();
const brandController = require('../controllers/admin/brandController');
const adminAuth = require('../middleware/adminAuth');

// --- User (Public) Routes ---
// GET /api/brands/active -> Gets all active brands for the animated marquee
router.get('/active', brandController.getActiveBrands);

// --- Admin Protected Routes ---
// The path logic assumes this gets mounted correctly in server.js
router.get('/admin/all', adminAuth, brandController.getAllBrands);
router.post('/admin/create', adminAuth, brandController.createBrand);
router.put('/admin/:id', adminAuth, brandController.updateBrand);
router.delete('/admin/:id', adminAuth, brandController.deleteBrand);

module.exports = router;
