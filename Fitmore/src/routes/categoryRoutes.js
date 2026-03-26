const express = require('express');
const router = express.Router();

const adminAuth = require('../middleware/adminAuth');

const controller = require('../controllers/category');


router.get('/', controller.getCategories);
router.get('/:id', controller.getCategory);
router.post('/', adminAuth, controller.createCategory);
router.put('/:id', adminAuth, controller.updateCategory);
router.delete('/:id', adminAuth, controller.deleteCategory);

module.exports = router;
