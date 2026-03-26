const Offer = require('../../models/Offer');

// Get all active offers
exports.getActiveOffers = async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({
            isActive: true,
            $or: [
                { validUntil: { $exists: false } }, // No expiry date set
                { validUntil: null },               // No expiry date set
                { validUntil: { $gte: now } }       // Not expired yet
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, offers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching offers', error: error.message });
    }
};
