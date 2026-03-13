const Review = require('../../models/Review');
const Product = require('../../models/productModel');

// User: Add a new review (defaults to pending)
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: 'Rating and comment are required' });
        }

        const review = new Review({
            user: req.user.id,
            product: productId,
            rating: Number(rating),
            comment,
            status: 'pending'
        });

        await review.save();
        res.status(201).json({ success: true, message: 'Review submitted and is awaiting approval.' });

    } catch (err) {
        console.error('Add Review Error:', err);
        res.status(500).json({ success: false, message: 'Server error adding review' });
    }
};

// User: Get all approved reviews for a specific product
exports.getApprovedReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviews = await Review.find({ product: productId, status: 'approved' })
            .populate('user', 'name firstName')
            .sort('-createdAt');

        res.json({ success: true, reviews });
    } catch (err) {
        console.error('Get Approved Reviews Error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching reviews' });
    }
};

// Admin: Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'name firstName email')
            .populate('product', 'name price image')
            .sort('-createdAt');

        res.json({ success: true, reviews });
    } catch (err) {
        console.error('Admin Get All Reviews Error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching all reviews' });
    }
};

// Admin: Update review status
exports.updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.json({ success: true, message: `Review ${status}`, review });
    } catch (err) {
        console.error('Admin Update Review Status Error:', err);
        res.status(500).json({ success: false, message: 'Server error updating review' });
    }
};

// Admin: Delete review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Admin Delete Review Error:', err);
        res.status(500).json({ success: false, message: 'Server error deleting review' });
    }
};
