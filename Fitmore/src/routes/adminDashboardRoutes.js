const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const adminController =
  require("../controllers/admin");

/* DASHBOARD DATA */
router.get(
  "/dashboard",
  auth,
  admin,
  adminController.getDashboardStats
);

/* ALL CUSTOMERS */
router.get(
  "/customers",
  auth,
  admin,
  adminController.getAllCustomers
);

module.exports = router;