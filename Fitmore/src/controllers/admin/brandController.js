const Brand = require('../../models/Brand');

// Create a new brand
exports.createBrand = async (req, res) => {
    try {
        const { name, imageUrl, isActive } = req.body;
        
        if (!name || !imageUrl) {
            return res.status(400).json({ success: false, message: "Name and Image URL are required" });
        }

        const brand = new Brand({
            name,
            imageUrl,
            isActive: isActive !== undefined ? isActive : true
        });

        await brand.save();

        res.status(201).json({ success: true, message: "Brand created successfully", brand });
    } catch (err) {
        console.error("Error creating brand:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all brands (For Admin)
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, brands });
    } catch (err) {
        console.error("Error fetching all brands:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a brand
exports.updateBrand = async (req, res) => {
    try {
        const { name, imageUrl, isActive } = req.body;
        
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name, imageUrl, isActive },
            { new: true, runValidators: true }
        );

        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }

        res.status(200).json({ success: true, message: "Brand updated successfully", brand });
    } catch (err) {
        console.error("Error updating brand:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }

        res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (err) {
        console.error("Error deleting brand:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get active brands (For User Marquee)
exports.getActiveBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, brands });
    } catch (err) {
        console.error("Error fetching active brands:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
