require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitmore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB");
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
        console.log("SUCCESS:", orders.length);
        console.log("FIRST ORDER USER:", orders[0] ? orders[0].user : "no orders");
    } catch (err) {
        console.error("ERROR from mongoose: ", err.message);
        console.error(err.stack);
    }
    process.exit(0);
  })
  .catch(err => { console.error("DB conn err", err); process.exit(1); });
