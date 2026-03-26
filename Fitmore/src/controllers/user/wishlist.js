const User = require('../../models/User');
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving wishlist' });
    }
};
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const index = user.wishlist.indexOf(productId);
        let added = false;

        if (index === -1) {
            // Add to wishlist
            user.wishlist.push(productId);
            added = true;
        } else {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: added ? 'Added to wishlist' : 'Removed from wishlist',
            added,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        res.status(500).json({ success: false, message: 'Server error updating wishlist' });
    }
};
