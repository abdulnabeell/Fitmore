const Order = require("../../models/Order");

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Optional: ensure only owner cancels
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        order.status = req.body.status;

        await order.save();

        res.json({
            message: "Order updated",
            order
        });

    } catch (err) {
        res.status(500).json({
            message: "Update failed"
        });
    }
};
