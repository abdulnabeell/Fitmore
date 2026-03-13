const Product = require('../../models/productModel');

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(product);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
