const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');

const { addAddress, getAddresses, updateAddress, deleteAddress, updateProfile, getWishlist, toggleWishlist, validateCoupon, getAvailableCoupons, getWallet, addWalletFunds, getActiveOffers } = require('../controllers/user');

const User = require('../models/User');

router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'Access granted',
      user: user
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

router.put('/profile', userAuth, updateProfile);

router.get('/wishlist', userAuth, getWishlist);
router.post('/wishlist/toggle', userAuth, toggleWishlist);

router.post('/address', userAuth, addAddress);
router.get('/addresses', userAuth, getAddresses);
router.put('/address/:id', userAuth, updateAddress);
router.delete('/address/:id', userAuth, deleteAddress);

router.post('/coupons/validate', userAuth, validateCoupon);
router.get('/coupons/available', getAvailableCoupons);

router.get('/wallet', userAuth, getWallet);
router.post('/wallet/add', userAuth, addWalletFunds);

// Publicly available routes
router.get('/offers', getActiveOffers);

module.exports = router;
