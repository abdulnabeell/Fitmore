const User = require('../../models/User');
const otpGenerator = require('otp-generator');
const sendOtp = require('../../utils/sendOtp');

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
