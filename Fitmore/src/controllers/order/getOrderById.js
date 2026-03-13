const Order = require("../../models/Order");

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Ensure the logged-in user owns this order (or is an admin)
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized to view this order" });
        }

        res.json({ success: true, order });

    } catch (err) {
        console.error("Get Order By Id Error:", err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(500).json({ success: false, message: "Server error retrieving order" });
    }
};
