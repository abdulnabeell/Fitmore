const Order = require("../../models/Order");
const User = require("../../models/User");

exports.getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 1. Find all users, excluding those explicitly marked as admin
        const query = { role: { $ne: "admin" } };

        // Based on stats logic above, role: "user" seems to be used, but older docs may lack the field.

        const totalCustomers = await User.countDocuments(query);

        const customers = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // 2. For each customer, get their order count and total spend
        const customerList = await Promise.all(
            customers.map(async (customer) => {
                const orderStats = await Order.aggregate([
                    { $match: { user: customer._id } },
                    {
                        $group: {
                            _id: null,
                            orderCount: { $sum: 1 },
                            totalSpend: { $sum: "$total" }
                        }
                    }
                ]);

                return {
                    _id: customer._id,
                    name: customer.name || "N/A",
                    email: customer.email,
                    phone: customer.phone || "N/A",
                    status: customer.status || "Active", // Assuming status exists, default to Active
                    orderCount: orderStats.length > 0 ? orderStats[0].orderCount : 0,
                    totalSpend: orderStats.length > 0 ? orderStats[0].totalSpend : 0,
                    createdAt: customer.createdAt
                };
            })
        );

        res.json({
            success: true,
            customers: customerList,
            pagination: {
                total: totalCustomers,
                page,
                pages: Math.ceil(totalCustomers / limit)
            }
        });

    } catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
};
