const Coupon = require('../../models/Coupon');

/**
 * @desc    Create a new coupon
 * @route   POST /api/admin/coupons
 * @access  Private/Admin
 */
exports.createCoupon = async (req, res) => {
    try {
        const { code, type, value, minPurchase, limit, expiryDate, isActive } = req.body;

        // Check if exists
        const exists = await Coupon.findOne({ code: code.toUpperCase() });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            type,
            value,
            minPurchase: minPurchase || 0,
            limit: limit || 0,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            isActive: isActive !== undefined ? isActive : true
        });

        await coupon.save();

        res.status(201).json({
            success: true,
            coupon
        });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get all coupons
 * @route   GET /api/admin/coupons
 * @access  Private/Admin
 */
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: coupons.length,
            coupons
        });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/admin/coupons/:id
 * @access  Private/Admin
 */
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Coupon removed'
        });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
