const User = require('../../models/User');

exports.addAddress = async (req, res) => {
    try {
        const { name, ph, pin, addressLine } = req.body;

        if (!name || !ph || !pin || !addressLine) {
            return res.status(400).json({ success: false, message: "Please provide all address details" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.addresses.push({ name, ph, pin, addressLine });
        await user.save();

        res.status(201).json({ success: true, message: "Address added successfully", addresses: user.addresses });
    } catch (err) {
        console.error("Error adding address:", err);
        res.status(500).json({ success: false, message: "Server error saving address" });
    }
};
