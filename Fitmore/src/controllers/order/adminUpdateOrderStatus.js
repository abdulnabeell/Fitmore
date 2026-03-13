const Order = require("../../models/Order");

exports.adminUpdateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = req.body.status;
        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update order status" });
    }
};
