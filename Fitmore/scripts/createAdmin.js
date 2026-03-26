const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// connect DB
mongoose.connect('mongodb://127.0.0.1:27017/fitmore');

(async () => {
  const hashed = await bcrypt.hash('admin123', 10);

  await User.create({
    name: 'Admin',
    email: 'admin@fitmore.com',
    password: hashed,
    role: 'admin'
  });

  console.log('✅ Admin created successfully');
  process.exit();
})();
