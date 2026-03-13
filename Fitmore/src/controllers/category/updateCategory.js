const Category = require('../../models/Category');

// Helper to create slug
const createSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, description, image, status } = req.body;
        const updateData = { name, description, image, status };

        if (name) {
            updateData.slug = createSlug(name);
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
