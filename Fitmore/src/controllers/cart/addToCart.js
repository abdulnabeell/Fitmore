const Cart = require("../../models/Cart");
const Product = require("../../models/productModel");

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);

    if (!product)
        return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    // Create cart if first time
    if (!cart) {
        cart = new Cart({
            user: userId,
            items: []
        });
    }

    const existingItem = cart.items.find(
        item => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
            qty
        });
    }

    await cart.save();

    res.json(cart);
};
