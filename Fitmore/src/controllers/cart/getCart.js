const Cart = require("../../models/Cart");

exports.getCart = async (req, res) => {
    let cart = await Cart.findOne({
        user: req.user.id
    });

    // create empty cart automatically
    if (!cart) {
        cart = await Cart.create({
            user: req.user.id,
            items: []
        });
    }

    res.json(cart);
};
