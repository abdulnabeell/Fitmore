const User = require('../../models/User');
const otpGenerator = require('otp-generator');
const sendOtp = require('../../utils/sendOtp');

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
