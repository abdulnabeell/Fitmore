const Order = require("../../models/Order");
const User = require("../../models/User");

exports.getDashboardStats = async (req, res) => {
    try {
        /* =====================
           BASIC ORDER STATS
        ===================== */

        const totalOrders = await Order.countDocuments();

        const totalSalesData = await Order.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        const totalSales =
            totalSalesData.length > 0
                ? totalSalesData[0].total
                : 0;

        const pending = await Order.countDocuments({ status: "Processing" });
        const cancelled = await Order.countDocuments({ status: "Cancelled" });
        const delivered = await Order.countDocuments({ status: "Delivered" });

        /* =====================
           CUSTOMER OVERVIEW
        ===================== */

        // Total Customers
        const activeCustomers = await User.countDocuments({
            role: { $ne: "admin" } // Catch all users even if role field is missing from older documents
        });

        // Repeat Customers (ordered more than once)
        const repeatCustomerData = await Order.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $match: {
                    totalOrders: { $gt: 1 }
                }
            },
            {
                $count: "repeatCustomers"
            }
        ]);

        const repeatCustomers =
            repeatCustomerData.length > 0
                ? repeatCustomerData[0].repeatCustomers
                : 0;

        // New Customers (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newCustomers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        /* =====================
           WEEKLY SALES
        ===================== */

        const weeklySalesData = await Order.aggregate([
            {
                $match: { status: "Delivered" }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    total: { $sum: "$total" }
                }
            }
        ]);

        const weeklySales = [0, 0, 0, 0, 0, 0, 0];

        weeklySalesData.forEach(item => {
            const index = item._id - 1; // MongoDB dayOfWeek starts from 1
            weeklySales[index] = item.total;
        });

        /* =====================
           MONTHLY SALES
        ===================== */

        const monthlySalesData = await Order.aggregate([
            {
                $match: { status: "Delivered" }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$total" }
                }
            }
        ]);

        const monthlySales = new Array(12).fill(0);

        monthlySalesData.forEach(item => {
            monthlySales[item._id - 1] = item.total;
        });

        /* =====================
           RECENT ORDERS
        ===================== */

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        /* =====================
           TOP CUSTOMERS
        ===================== */

        const topCustomers = await Order.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalSpent: { $sum: "$total" }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);

        /* =====================
           RESPONSE
        ===================== */

        res.json({
            success: true,

            totalOrders,
            totalSales,

            pending,
            cancelled,
            delivered,

            activeCustomers,
            repeatCustomers,
            newCustomers,

            weeklySales,
            monthlySales,

            recentOrders,
            topCustomers
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Dashboard load failed"
        });
    }
};
