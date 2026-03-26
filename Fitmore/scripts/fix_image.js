const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/productModel');

const fixImage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitmore');

        // Find the product and update its image
        await Product.updateOne(
            { name: 'Creatine Detail Pack' },
            { $set: { images: ['/user/images/creatine-on.jpg'] } }
        );
        console.log('Successfully updated image for Creatine Detail Pack');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixImage();
