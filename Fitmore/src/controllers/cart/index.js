const { addToCart } = require('./addToCart');
const { getCart } = require('./getCart');
const { updateQty } = require('./updateQty');
const { removeItem } = require('./removeItem');
const { clearCart } = require('./clearCart');

module.exports = {
    addToCart,
    getCart,
    updateQty,
    removeItem,
    clearCart
};
