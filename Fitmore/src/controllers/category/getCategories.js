const Category = require('../../models/Category');

exports.getCategories = async (req, res) => {
    try {
        let query = { status: 'Published' };

        // Check if admin mode is requested
        if (req.query.mode === 'admin') {
            const jwt = require('jsonwebtoken');
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    if (decoded.role === 'admin') {
                        query = {}; // Show all
                    }
                } catch (e) {
                    // Invalid token, keep public
                }
            }
        }

        const categories = await Category.find(query).sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
