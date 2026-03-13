const { createProduct } = require('./createProduct');
const { getProducts } = require('./getProducts');
const { getProductById } = require('./getProductById');
const { updateProduct } = require('./updateProduct');
const { deleteProduct } = require('./deleteProduct');
const { getSingleProduct } = require('./getSingleProduct');

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getSingleProduct
};
