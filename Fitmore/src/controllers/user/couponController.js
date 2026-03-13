const Coupon = require('../../models/Coupon');

/**
 * @desc    Validate a coupon code
 * @route   POST /api/user/coupons/validate
 * @access  Private
 */
exports.validateCoupon = async (req, res) => {
    
    try {
        const { code, cartTotal } = req.body;
   

        if (!code) {
            return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
        }

        // Find the coupon
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or non-existent coupon' });
        }
         console.log("hii2");

        // Check if active
        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
        }
         console.log("hii3");

        // Check expiry
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ success: false, message: 'This coupon has expired' });
        }
         console.log("hii4");

        // Check limit
        if (coupon.limit > 0 && coupon.usedCount >= coupon.limit) {
            return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
        }
         console.log("hii5");

        // Check minimum purchase
        if (coupon.minPurchase > 0 && (!cartTotal || cartTotal < coupon.minPurchase)) {
            return res.status(400).json({ success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required` });
        }
         console.log("hii6");

        // Calculate discount amount
        let discountAmount = 0;
        if (cartTotal) {
            if (coupon.type === 'percentage') {
                discountAmount = (cartTotal * coupon.value) / 100;
                         console.log("hii7");

            } else if (coupon.type === 'fixed') {
                discountAmount = coupon.value;
                // Don't let discount exceed total
                if (discountAmount > cartTotal) {
                    discountAmount = cartTotal;
                }
            }
        }

        // Increment used count conceptually happens during checkout (order placement), not validation,
        // but for now we just validate.

        res.status(200).json({
            success: true,
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                discountAmount: discountAmount
            },
            message: 'Coupon applied successfully'
        });

    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
