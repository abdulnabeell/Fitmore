const Cart = require("../../models/Cart");

exports.clearCart = async (req, res) => {
    await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [] }
    );

    res.json({ message: "Cart cleared" });
};
