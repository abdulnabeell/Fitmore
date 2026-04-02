const mongoose = require('mongoose');
const Order = require('./src/models/Order');

async function test() {
    try {
        await mongoose.connect('mongodb+srv://abdulnabeel054_db_user:Nc6e9RGxYblwx8AQ@cluster0.3u1vsc9.mongodb.net/fitmore?retryWrites=true&w=majority');
        
        let order = await Order.findOne({ status: "PLACED" });
        if (!order) {
            console.log("No placed order found");
            process.exit();
        }

        console.log("Testing partial cancel on order:", order._id);
        
        // Simulate partial cancel
        const itemIds = [order.items[0]._id.toString()];
        
        itemIds.forEach(idToCancel => {
            const item = order.items.find(i => i._id.toString() === idToCancel);
            if (item && !item.cancelled) {
                item.cancelled = true;
                order.total -= (item.price * item.qty);
            }
        });

        if (order.total < 0) order.total = 0;

        const allCancelled = order.items.every(i => i.cancelled);
        if (allCancelled) {
            order.status = "CANCELLED";
        }
        
        console.log("Saving order...");
        await order.save();
        console.log("Save successful!");
        
    } catch (e) {
        console.error("Crash:", e.message);
        console.error(e.stack);
    } finally {
        mongoose.disconnect();
    }
}
test();
