const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review/reviewController');
const auth = require('../middleware/authMiddleware'); // Verify User
const admin = require('../middleware/adminAuth'); // Verify Admin

// Admin Routes for Reviews
router.get('/all', auth, admin, reviewController.getAllReviews);
router.put('/:id/status', auth, admin, reviewController.updateReviewStatus);
router.delete('/:id', auth, admin, reviewController.deleteReview);

module.exports = router;
