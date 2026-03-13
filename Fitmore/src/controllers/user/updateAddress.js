const User = require('../../models/User');

exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ph, pin, addressLine } = req.body;

        const user = await User.findOneAndUpdate(
            { _id: req.user.id, "addresses._id": id },
            {
                $set: {
                    "addresses.$.name": name,
                    "addresses.$.ph": ph,
                    "addresses.$.pin": pin,
                    "addresses.$.addressLine": addressLine
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User or address not found" });
        }

        res.json({ success: true, message: "Address updated successfully", addresses: user.addresses });
    } catch (err) {
        console.error("Error updating address:", err);
        res.status(500).json({ success: false, message: "Server error updating address" });
    }
};
