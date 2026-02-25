const Category = require('../models/Category');

// Helper to create slug
const createSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

exports.getCategories = async (req, res) => {
  try {
    let query = { status: 'Published' };

    // Check if admin mode is requested
    if (req.query.mode === 'admin') {
      // Ideally we should check auth here or rely on the fact that this might be an open route 
      // but we want admin dashboard to see all. 
      // For now, let's keep it simple: if mode=admin, show all. 
      // Security note: In a real app, we MUST verify the token here too if we want to restrict 'Draft' visibility.
      // Since the route is currently public (GET /), let's inspect the header manually if needed 
      // or just allow it for now as per "simple integration" request. 
      // BETTER APPROACH: Verify token if present.
      const jwt = require('jsonwebtoken');
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.role === 'admin') {
            query = {}; // Show all
          }
        } catch (e) {
          // Invalid token, keep public
        }
      }
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
