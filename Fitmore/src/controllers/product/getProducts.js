const Product = require('../../models/productModel');

exports.getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        let productsQuery = Product.find(query);

        // Sorting Logic
        if (sort) {
            if (sort === 'price_asc') {
                productsQuery = productsQuery.sort({ price: 1 });
            } else if (sort === 'price_desc') {
                productsQuery = productsQuery.sort({ price: -1 });
            } else if (sort === 'newest' || sort === '-createdAt') {
                productsQuery = productsQuery.sort({ createdAt: -1 });
            } else {
                productsQuery = productsQuery.sort({ createdAt: -1 }); // Default to newest
            }
        }

        if (req.query.limit) {
            const limitVal = parseInt(req.query.limit, 10);
            if (!isNaN(limitVal)) {
                productsQuery = productsQuery.limit(limitVal);
            }
        }

        const result = await productsQuery;

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
