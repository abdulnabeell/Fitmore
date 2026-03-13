const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const orderController = require("../controllers/order");

// User routes
router.post("/", auth, orderController.createOrder);
router.get("/myorders", auth, orderController.getMyOrders);
router.get("/:id", auth, orderController.getOrderById);
router.put("/:id/cancel", auth, orderController.cancelOrder);
router.put("/:id/return", auth, orderController.returnOrder);
router.put("/:id", auth, orderController.updateOrderStatus);

// Admin routes
router.get("/admin/all", auth, admin, orderController.getAllOrders);
router.put("/admin/:id/status", auth, admin, orderController.adminUpdateOrderStatus);

module.exports = router;
// const router = require("express").Router();

// const auth = require("../middleware/authMiddleware");
// const admin = require("../middleware/adminMiddleware");

// const orderController =
// require("../controllers/orderController");

// /* ======================
//    USER ROUTES
// ====================== */

// // Create Order
// router.post("/", auth, orderController.createOrder);

// // Get logged user orders
// router.get("/myorders", auth, orderController.getMyOrders);

// // Get single order details
// router.get("/:id", auth, orderController.getOrderById);


// /* ======================
//    ADMIN ROUTES
// ====================== */

// // Get all orders
// router.get("/", auth, admin, orderController.getAllOrders);

// // Update order status
// router.put("/:id", auth, admin, orderController.updateOrderStatus);

// module.exports = router;