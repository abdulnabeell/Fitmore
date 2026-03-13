const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const { addAddress, getAddresses, updateAddress, deleteAddress, updateProfile, getWishlist, toggleWishlist, validateCoupon, getWallet, addWalletFunds } = require('../controllers/user');

const User = require('../models/User');

router.get('/profile', auth, async (req, res) => {
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

router.put('/profile', auth, updateProfile);

router.get('/wishlist', auth, getWishlist);
router.post('/wishlist/toggle', auth, toggleWishlist);

router.post('/address', auth, addAddress);
router.get('/addresses', auth, getAddresses);
router.put('/address/:id', auth, updateAddress);
router.delete('/address/:id', auth, deleteAddress);

router.post('/coupons/validate', auth, validateCoupon);

router.get('/wallet', auth, getWallet);
router.post('/wallet/add', auth, addWalletFunds);

module.exports = router;
