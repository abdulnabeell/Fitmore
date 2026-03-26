const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');

// connect DB
mongoose.connect('mongodb://127.0.0.1:27017/fitmore');

(async () => {
  const hashed = await bcrypt.hash('admin123', 10);

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: 'admin@fitmore.com' });
  if (existingAdmin) {
    console.log('✅ Admin already exists in Admin collection');
    process.exit();
  }

  await Admin.create({
    email: 'admin@fitmore.com',
    password: hashed,
    role: 'admin'
  });

  console.log('✅ Admin created successfully in Admin collection');
  process.exit();
})();
