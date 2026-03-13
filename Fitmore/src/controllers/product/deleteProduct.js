const Product = require('../../models/productModel');

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
