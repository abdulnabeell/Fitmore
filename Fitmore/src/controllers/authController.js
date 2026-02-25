const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const sendOtp = require('../utils/sendOtp');


// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     res.status(201).json({ message: 'Signup successful', user });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // const jwt = require('jsonwebtoken');

// // exports.login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user)
// //       return res.status(400).json({ message: 'User not found' });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch)
// //       return res.status(400).json({ message: 'Invalid credentials' });

// //     // Create JWT token
// //     const token = jwt.sign(
// //       { userId: user._id },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '7d' }
// //     );

// //     res.json({
// //       message: 'Login successful',
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email
// //       }
// //     });

// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };


// ================== SIGNUP ==================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

   const otp = otpGenerator.generate(6, {
  digits: true,
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false
});


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false
    });

    await sendOtp(email, otp);

    res.status(201).json({
      message: 'OTP sent to email',
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================== VERIFY OTP ==================
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: 'Account verified successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================== RESEND OTP ==================
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      specialChars: false
    });

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendOtp(user.email, otp);

    res.json({ message: 'OTP resent successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//forgot pass
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    user.forgotOtp = otp;
    user.forgotOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendOtp(email, otp);

    res.json({
      message: 'OTP sent',
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: 'User not found' });

//     // const otp = otpGenerator.generate(6, {
//     //   digits: true,
//     //   alphabets: false,
//     //   upperCaseAlphabets: false,
//     //   specialChars: false
//     // });
//       const otp = otpGenerator.generate(6, {
//       digits: true,
//      lowerCaseAlphabets: false,
//      upperCaseAlphabets: false,
//       specialChars: false
//     });


//     user.forgotOtp = otp;
//     user.forgotOtpExpiry = Date.now() + 5 * 60 * 1000;

//     await user.save();
//     await sendOtp(email, otp);

//     res.json({ message: 'OTP sent', userId: user._id });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



//reset pass
exports.resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user || user.forgotOtp !== otp || Date.now() > user.forgotOtpExpiry)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);

    user.forgotOtp = null;
    user.forgotOtpExpiry = null;

    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//verify 
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user || user.forgotOtp !== otp || Date.now() > user.forgotOtpExpiry)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'OTP verified' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// exports.resetPassword = async (req, res) => {
//   try {
//     const { userId, otp, newPassword } = req.body;

//     const user = await User.findById(userId);

//     if (!user)
//       return res.status(400).json({ message: 'User not found' });

//     if (user.forgotOtp !== otp)
//       return res.status(400).json({ message: 'Invalid OTP' });

//     if (Date.now() > user.forgotOtpExpiry)
//       return res.status(400).json({ message: 'OTP expired' });

//     const hashed = await bcrypt.hash(newPassword, 10);

//     user.password = hashed;
//     user.forgotOtp = null;
//     user.forgotOtpExpiry = null;

//     await user.save();

//     res.json({ message: 'Password updated successfully' });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



//login
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   // ✅ BLOCK LOGIN IF NOT VERIFIED
//   if (!user.isVerified)
//     return res.status(403).json({ message: "Please verify your email first" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: "Wrong password" });

//   const token = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: 'lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000
//   });

//   res.json({ message: "Login successful" });
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Please verify your email first" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role }, // ⭐ include role in token
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // ⭐ send token + role to frontend
  res.json({
    token,
    role: user.role,
    message: "Login successful"
  });
};
