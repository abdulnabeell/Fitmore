const router = require("express").Router();

const userAuth = require("../middleware/userAuth");
const cartController = require("../controllers/cart");

/* ======================
   CART ROUTES
====================== */

// Add item
router.post("/add", userAuth, cartController.addToCart);

// Get user cart
router.get("/", userAuth, cartController.getCart);

// Update quantity (+ / -)
router.put("/update", userAuth, cartController.updateQty);

// Remove item
router.delete("/remove", userAuth, cartController.removeItem);

router.delete("/clear", userAuth, cartController.clearCart);

module.exports = router;