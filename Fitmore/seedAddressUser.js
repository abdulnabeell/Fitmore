const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitmore').then(async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.findOneAndUpdate(
            { email: 'johnaddress@test.com' },
            {
                name: 'John Address',
                email: 'johnaddress@test.com',
                password: hashedPassword,
                isVerified: true,
                role: 'user'
            },
            { upsert: true, new: true }
        );
        console.log('User created and verified successfully.');
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
