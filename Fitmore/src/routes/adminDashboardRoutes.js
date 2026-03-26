const router = require("express").Router();

const adminAuth = require("../middleware/adminAuth");

const adminController =
  require("../controllers/admin");

/* DASHBOARD DATA */
router.get(
  "/dashboard",
  adminAuth,
  adminController.getDashboardStats
);

/* ALL CUSTOMERS */
router.get(
  "/customers",
  adminAuth,
  adminController.getAllCustomers
);

module.exports = router;