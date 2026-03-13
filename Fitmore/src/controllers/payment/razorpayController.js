const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../../models/Order');

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ success: false, message: 'Razorpay keys not configured configured on server.' });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Amount in paise (multiply by 100)
            currency: 'INR',
            receipt: 'receipt_order_' + Date.now(),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });

        res.json({ success: true, order });
    } catch (error) {
        console.error('Razorpay Create Order Error:', error);
        res.status(500).json({ success: false, message: 'Server error creating Razorpay order', error: error.message });
    }
};

// Verify Signature
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Razorpay Verify Error:', error);
        res.status(500).json({ success: false, message: 'Server error verifying payment' });
    }
};

// Expose Public Key ID to Frontend
exports.getRazorpayKey = (req, res) => {
    res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
};
