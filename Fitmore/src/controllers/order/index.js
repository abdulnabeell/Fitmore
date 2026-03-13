const { createOrder } = require('./createOrder');
const { getMyOrders } = require('./getMyOrders');
const { updateOrderStatus } = require('./updateOrderStatus');
const { getAllOrders } = require('./getAllOrders');
const { adminUpdateOrderStatus } = require('./adminUpdateOrderStatus');
const { getOrderById } = require('./getOrderById');
const { cancelOrder } = require('./cancelOrder');
const { returnOrder } = require('./returnOrder');

module.exports = {
    createOrder,
    getMyOrders,
    updateOrderStatus,
    getAllOrders,
    adminUpdateOrderStatus,
    getOrderById,
    cancelOrder,
    returnOrder
};
