const { addAddress } = require('./addAddress');
const { getAddresses } = require('./getAddresses');
const { updateAddress } = require('./updateAddress');
const { deleteAddress } = require('./deleteAddress');
const { updateProfile } = require('./updateProfile');
const { getWishlist, toggleWishlist } = require('./wishlist');
const { validateCoupon } = require('./couponController');
const { getWallet, addWalletFunds } = require('./walletController');

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    updateProfile,
    getWishlist,
    toggleWishlist,
    validateCoupon,
    getWallet,
    addWalletFunds
};
