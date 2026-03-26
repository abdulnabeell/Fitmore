const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review/reviewController');
const adminAuth = require('../middleware/adminAuth'); // Verify Admin

// Admin Routes for Reviews
router.get('/all', adminAuth, reviewController.getAllReviews);
router.put('/:id/status', adminAuth, reviewController.updateReviewStatus);
router.delete('/:id', adminAuth, reviewController.deleteReview);

module.exports = router;
