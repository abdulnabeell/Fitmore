const User = require('../../models/User');

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
