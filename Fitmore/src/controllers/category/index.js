const { getCategories } = require('./getCategories');
const { getCategory } = require('./getCategory');
const { createCategory } = require('./createCategory');
const { updateCategory } = require('./updateCategory');
const { deleteCategory } = require('./deleteCategory');

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
