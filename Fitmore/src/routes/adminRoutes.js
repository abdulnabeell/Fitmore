const express = require('express');
const router = express.Router();
const { adminLogin, createCoupon, getCoupons, deleteCoupon, getAdminProfile, createOffer, getOffers, updateOffer, deleteOffer } = require('../controllers/admin');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', adminLogin);
router.get('/profile', adminAuth, getAdminProfile);

// Coupon management logic 
router.post('/coupons', adminAuth, createCoupon);
router.get('/coupons', adminAuth, getCoupons);
router.delete('/coupons/:id', adminAuth, deleteCoupon);

// Offer management logic
router.post('/offers', adminAuth, createOffer);
router.get('/offers', adminAuth, getOffers);
router.put('/offers/:id', adminAuth, updateOffer);
router.delete('/offers/:id', adminAuth, deleteOffer);

module.exports = router;
