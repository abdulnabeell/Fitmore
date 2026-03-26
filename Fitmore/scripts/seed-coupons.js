require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./src/models/Coupon');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Fitmore');
        console.log('Connected to DB');

        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 3);

        const newCoupons = [
            {
                code: 'WELCOME10',
                type: 'percentage',
                value: 10,
                minPurchase: 1000,
                limit: 100,
                expiryDate: expiry,
                isActive: true
            },
            {
                code: 'FIT20',
                type: 'percentage',
                value: 20,
                minPurchase: 3000,
                limit: 50,
                expiryDate: expiry,
                isActive: true
            },
            {
                code: 'FLAT500',
                type: 'fixed',
                value: 500,
                minPurchase: 2000,
                limit: 0,
                expiryDate: expiry,
                isActive: true
            },
            {
                code: 'BEASTMODE',
                type: 'percentage',
                value: 15,
                minPurchase: 4000,
                limit: 0,
                expiryDate: expiry,
                isActive: true
            },
            {
                code: 'MEGA1000',
                type: 'fixed',
                value: 1000,
                minPurchase: 8000,
                limit: 20,
                expiryDate: expiry,
                isActive: true
            }
        ];

        for (const c of newCoupons) {
            await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true, new: true, setDefaultsOnInsert: true });
            console.log('Upserted ' + c.code);
        }

        console.log('Done');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seed();
