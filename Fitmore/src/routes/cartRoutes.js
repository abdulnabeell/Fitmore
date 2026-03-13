const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const cartController = require("../controllers/cart");

/* ======================
   CART ROUTES
====================== */

// Add item
router.post("/add", auth, cartController.addToCart);

// Get user cart
router.get("/", auth, cartController.getCart);

// Update quantity (+ / -)
router.put("/update", auth, cartController.updateQty);

// Remove item
router.delete("/remove", auth, cartController.removeItem);

router.delete("/clear", auth, cartController.clearCart);

module.exports = router;