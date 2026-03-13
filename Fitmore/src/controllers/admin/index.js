const { adminLogin } = require('./adminLogin');
const { getDashboardStats } = require('./getDashboardStats');
const { getAllCustomers } = require('./getAllCustomers');
const { createCoupon, getCoupons, deleteCoupon } = require('./couponController');

module.exports = {
    adminLogin,
    getDashboardStats,
    getAllCustomers,
    createCoupon,
    getCoupons,
    deleteCoupon
};
