const express = require('express');
const router = express.Router();
const { adminLogin, createCoupon, getCoupons, deleteCoupon } = require('../controllers/admin');
const auth = require('../middleware/authMiddleware');

router.post('/login', adminLogin);

// Coupon management logic - must use auth for validation of admin token (if auth exists, otherwise check role inside)
// Let's assume auth middleware verifies the token.
router.post('/coupons', auth, createCoupon);
router.get('/coupons', auth, getCoupons);
router.delete('/coupons/:id', auth, deleteCoupon);

module.exports = router;
