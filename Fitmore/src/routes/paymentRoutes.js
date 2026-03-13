const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/payment/razorpayController');
const protect = require('../middleware/authMiddleware');

router.post('/create-order', protect, razorpayController.createRazorpayOrder);
router.post('/verify-signature', protect, razorpayController.verifyRazorpayPayment);
router.get('/config', razorpayController.getRazorpayKey);

module.exports = router;
