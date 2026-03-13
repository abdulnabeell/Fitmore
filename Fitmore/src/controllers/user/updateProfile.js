const User = require('../../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        // Find user by jwt id
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update provided fields
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (email !== undefined) {
            // Optional: check if email is taken
            const emailTaken = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (emailTaken) return res.status(400).json({ message: 'Email is already in use' });
            user.email = email;
        }
        if (phone !== undefined) user.phone = phone;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
