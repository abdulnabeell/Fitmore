const User = require('../../models/User');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const sendOtp = require('../../utils/sendOtp');

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
