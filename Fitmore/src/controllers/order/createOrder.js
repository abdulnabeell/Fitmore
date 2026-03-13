const Order = require("../../models/Order");
const User = require("../../models/User");
const WalletTransaction = require("../../models/WalletTransaction");

exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            total
        } = req.body;

        // ✅ Check empty cart
        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "No order items"
            });
        }

        // ✅ Handle Wallet Payment
        if (paymentMethod === 'wallet') {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if ((user.walletBalance || 0) < total) {
                return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
            }

            // Deduct balance
            user.walletBalance -= total;
            await user.save();

            // Log Transaction
            await WalletTransaction.create({
                user: user._id,
                type: 'debit',
                amount: total,
                description: `Payment for order`
            });
        }

        const isPaid = paymentMethod === 'wallet'; // Assuming wallet is instant payment

        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
            total,
            orderStatus: "Processing",
            isPaid: isPaid,
            isDelivered: false
        });

        res.status(201).json({ success: true, order });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Order creation failed"
        });
    }
};
