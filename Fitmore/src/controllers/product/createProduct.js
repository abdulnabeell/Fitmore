const Product = require('../../models/productModel');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
