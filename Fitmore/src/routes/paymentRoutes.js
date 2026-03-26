const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/payment/razorpayController');
const userAuth = require('../middleware/userAuth');

router.post('/create-order', userAuth, razorpayController.createRazorpayOrder);
router.post('/verify-signature', userAuth, razorpayController.verifyRazorpayPayment);
router.get('/config', razorpayController.getRazorpayKey);

module.exports = router;
