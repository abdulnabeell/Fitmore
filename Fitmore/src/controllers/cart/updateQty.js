const Cart = require("../../models/Cart");

exports.updateQty = async (req, res) => {
    const { productId, change } = req.body;

    const cart = await Cart.findOne({
        user: req.user.id
    });

    if (!cart)
        return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
        item => item.product.toString() === productId
    );

    if (!item)
        return res.status(404).json({ message: "Item not found" });

    item.qty += change;

    // remove if qty becomes 0
    if (item.qty <= 0) {
        cart.items = cart.items.filter(
            i => i.product.toString() !== productId
        );
    }

    await cart.save();

    res.json(cart);
};
