const User = require('../../models/User');
const WalletTransaction = require('../../models/WalletTransaction');
const crypto = require('crypto');

exports.getWallet = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const transactions = await WalletTransaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            walletBalance: user.walletBalance || 0,
            transactions
        });
    } catch (err) {
        console.error('Get Wallet Error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching wallet details' });
    }
};

exports.addWalletFunds = async (req, res) => {
    try {
        const { amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify Signature
        if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
            const sign = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest('hex');

            if (razorpay_signature !== expectedSign) {
                return res.status(400).json({ success: false, message: 'Invalid payment signature' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.walletBalance = (user.walletBalance || 0) + parsedAmount;
        await user.save();

        const transaction = new WalletTransaction({
            user: user._id,
            type: 'credit',
            amount: parsedAmount,
            description: `Deposited funds via Razorpay`
        });
        await transaction.save();

        res.json({
            success: true,
            message: `Successfully added ₹${parsedAmount.toFixed(2)} to wallet!`,
            walletBalance: user.walletBalance
        });
    } catch (err) {
        console.error('Add Funds Error:', err);
        res.status(500).json({ success: false, message: 'Server error adding funds' });
    }
};
