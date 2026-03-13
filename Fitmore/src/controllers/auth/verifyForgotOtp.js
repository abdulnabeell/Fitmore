const User = require('../../models/User');

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
