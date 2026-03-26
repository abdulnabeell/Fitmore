// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');

// router.get('/', productController.getProducts);
// router.get('/:id', productController.getProductById);

// router.post('/', productController.createProduct);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

// module.exports = router;
//new

const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct, getSingleProduct
} = require('../controllers/product');

const { addReview, getApprovedReviews } = require('../controllers/review/reviewController');

const userAuth = require('../middleware/userAuth');
const adminAuth = require('../middleware/adminAuth');

// public
router.get('/', getProducts);
router.get('/single/:id', getSingleProduct);

router.get('/:id', getProductById);

// Reviews (Public/User)
router.get('/:id/reviews', getApprovedReviews);
router.post('/:id/reviews', userAuth, addReview);

// admin
// router.post('/', protect, adminOnly, createProduct);
// router.put('/:id', protect, adminOnly, updateProduct);
// router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);
router.get('/:id', getProductById);












module.exports = router;
