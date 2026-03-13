const User = require('../../models/User');
const bcrypt = require('bcrypt');

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
