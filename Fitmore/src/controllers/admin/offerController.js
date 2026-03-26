const Offer = require('../../models/Offer');

// Create a new offer
exports.createOffer = async (req, res) => {
    try {
        const { title, description, imageUrl, discountPercentage, validUntil, isActive } = req.body;

        const offer = new Offer({
            title,
            description,
            imageUrl,
            discountPercentage,
            validUntil,
            isActive: isActive !== undefined ? isActive : true
        });

        await offer.save();
        res.status(201).json({ success: true, offer, message: 'Offer created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error creating offer', error: error.message });
    }
};

// Get all offers (Admin)
exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, offers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching offers', error: error.message });
    }
};

// Update an offer
exports.updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const offer = await Offer.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        
        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        res.status(200).json({ success: true, offer, message: 'Offer updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error updating offer', error: error.message });
    }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await Offer.findByIdAndDelete(id);

        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        res.status(200).json({ success: true, message: 'Offer removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error deleting offer', error: error.message });
    }
};
