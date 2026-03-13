const Order = require("../../models/Order");

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {
        res.status(500).json({ message: "Failed to load orders" });
    }
};
