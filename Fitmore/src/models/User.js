// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isVerified: { type: Boolean, default: false }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   email: { type: String, required: true, unique: true },

//   password: { type: String, required: true },

//   // 🔥 OTP fields
//   otp: { type: String },
//   otpExpiry: { type: Date },

//   isVerified: { type: Boolean, default: false },
//   forgotOtp: String,
// forgotOtpExpiry: Date,


// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


//new one after product
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  // 🔥 OTP fields
  otp: { type: String },
  otpExpiry: { type: Date },

  isVerified: { type: Boolean, default: false },
  forgotOtp: String,
  forgotOtpExpiry: Date,

  // ✅ role field
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
