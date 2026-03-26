const Coupon = require('../../models/Coupon');

/**
 * @desc    Get all available and active coupons for users to view
 * @route   GET /api/user/coupons/available
 * @access  Public or Private (depending on implementation - here public to let them browse)
 */
exports.getAvailableCoupons = async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Find coupons that are:
        // 1. active
        // 2. not expired
        const coupons = await Coupon.find({
            isActive: true,
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gt: currentDate } }
            ]
        }).select('-__v -createdAt -updatedAt');

        // Filter out coupons that have reached their usage limit
        const availableCoupons = coupons.filter(coupon => {
            if (coupon.limit > 0 && coupon.usedCount >= coupon.limit) {
                return false;
            }
            return true;
        });

        res.status(200).json({
            success: true,
            count: availableCoupons.length,
            coupons: availableCoupons
        });

    } catch (error) {
        console.error('Error fetching available coupons:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
