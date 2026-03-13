const Order = require("../../models/Order");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        res.json({
            success: true,
            orders
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
