const User = require('../../models/User');

exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, addresses: user.addresses });
    } catch (err) {
        console.error("Error fetching addresses:", err);
        res.status(500).json({ success: false, message: "Server error fetching addresses" });
    }
};
