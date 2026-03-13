const Order = require("../../models/Order");

exports.returnOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify it belongs to user
        if (order.user.toString() !== req.user.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Check status logic
        if (order.status !== "DELIVERED") {
            return res.status(400).json({
                success: false,
                message: `Order cannot be returned because current status is ${order.status}`
            });
        }

        order.status = "RETURN_REQUESTED";
        await order.save();

        res.json({ success: true, message: "Return requested successfully", order });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during return" });
    }
};
