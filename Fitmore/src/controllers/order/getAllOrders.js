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
        console.error("GET_ALL_ORDERS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch orders", error: err.message, stack: err.stack });
    }
};
