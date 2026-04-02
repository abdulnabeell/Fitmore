const Order = require("../../models/Order");

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify it belongs to the user
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Check overall status
        if (order.status !== "PLACED" && order.status !== "CONFIRMED") {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled because it is already ${order.status}`
            });
        }

        const { itemIds } = req.body || {};

        if (itemIds && Array.isArray(itemIds) && itemIds.length > 0) {
            // Partial cancellation logic
            itemIds.forEach(idToCancel => {
                const item = order.items.find(i => i._id.toString() === idToCancel);
                if (item && !item.cancelled) {
                    item.cancelled = true;
                    order.total -= (item.price * item.qty);
                }
            });

            // Prevent negative total just in case
            if (order.total < 0) order.total = 0;

            // Check if ALL items are now cancelled
            const allCancelled = order.items.every(i => i.cancelled);
            if (allCancelled) {
                order.status = "CANCELLED";
            }
            
            await order.save();
            return res.json({ success: true, message: "Selected items cancelled successfully", order });
        } else {
            // Cancel whole order natively
            order.status = "CANCELLED";
            // Mark all items as cancelled
            order.items.forEach(item => {
                if (!item.cancelled) {
                    item.cancelled = true;
                }
            });
            await order.save();
            return res.json({ success: true, message: "Order cancelled successfully", order });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during cancellation", error: error.message, stack: error.stack });
    }
};
