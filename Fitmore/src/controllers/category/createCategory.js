const Category = require('../../models/Category');

// Helper to create slug
const createSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description, image, status } = req.body;
        const slug = createSlug(name);

        // Check if slug exists
        const slugExists = await Category.findOne({ slug });
        if (slugExists) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = await Category.create({
            name,
            description,
            image,
            status,
            slug
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
