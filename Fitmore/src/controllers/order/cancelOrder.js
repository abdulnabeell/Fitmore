const Order = require("../../models/Order");

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify it belongs to the user
        if (order.user.toString() !== req.user.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Check status logic
        if (order.status !== "PLACED" && order.status !== "CONFIRMED") {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled because it is already ${order.status}`
            });
        }

        order.status = "CANCELLED";
        await order.save();

        res.json({ success: true, message: "Order cancelled successfully", order });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during cancellation" });
    }
};
