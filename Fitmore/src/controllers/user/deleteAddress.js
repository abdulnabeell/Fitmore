const User = require('../../models/User');

exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { addresses: { _id: id } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Address removed successfully", addresses: user.addresses });
    } catch (err) {
        console.error("Error removing address:", err);
        res.status(500).json({ success: false, message: "Server error removing address" });
    }
};
