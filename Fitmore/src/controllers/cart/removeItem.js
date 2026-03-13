const Cart = require("../../models/Cart");

exports.removeItem = async (req, res) => {
    const { productId } = req.body;

    const cart = await Cart.findOne({
        user: req.user.id
    });

    if (!cart)
        return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
};
