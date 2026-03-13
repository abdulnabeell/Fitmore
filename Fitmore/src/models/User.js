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
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },

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
  },

  // ✅ addresses array
  addresses: [{
    name: { type: String, required: true },
    ph: { type: String, required: true },
    pin: { type: String, required: true },
    addressLine: { type: String, required: true }
  }],

  // ✅ wishlist array
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  // ✅ wallet balance
  walletBalance: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
