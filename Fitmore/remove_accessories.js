const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./src/models/Category');
const Product = require('./src/models/productModel');

const removeAccessories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitmore');
        console.log('MongoDB Connected...');

        await Category.deleteOne({ name: 'Accessories' });
        await Product.deleteMany({ category: 'Accessories' });

        console.log('Removed Accessories category and its products.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
removeAccessories();
