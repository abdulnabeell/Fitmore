// const express = require('express');
// const router = express.Router();
// const { signup,login } = require('../controllers/authController');

// router.post('/signup', signup);
// router.post('/login', login);

// module.exports = router;
const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  verifyOtp,
  resendOtp, forgotPassword, resetPassword, verifyForgotOtp
} = require('../controllers/auth');
const { logout } = require('../controllers/auth/logout');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-forgot-otp', verifyForgotOtp);
router.post('/logout', logout);


module.exports = router;
