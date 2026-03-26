const { adminLogin } = require('./adminLogin');
const { getDashboardStats } = require('./getDashboardStats');
const { getAllCustomers } = require('./getAllCustomers');
const { createCoupon, getCoupons, deleteCoupon } = require('./couponController');
const { getAdminProfile } = require('./adminProfile');
const { createOffer, getOffers, updateOffer, deleteOffer } = require('./offerController');

module.exports = {
    adminLogin,
    getDashboardStats,
    getAllCustomers,
    createCoupon,
    getCoupons,
    deleteCoupon,
    getAdminProfile,
    createOffer,
    getOffers,
    updateOffer,
    deleteOffer
};
