const User = require('../../models/User');

exports.getAdminProfile = async (req, res) => {
    try {
        // req.user is set by the adminAuth middleware (derived from auth.js)
        const adminId = req.user.id;
        
        // Find the admin in the User collection
        const admin = await User.findById(adminId).select('-password');
        
        if (!admin || admin.role !== 'admin') {
            return res.status(404).json({ success: false, message: 'Admin profile not found or unauthorized' });
        }
        
        res.json({
            success: true,
            admin: admin
        });
    } catch (err) {
        console.error('Error fetching admin profile:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving admin profile' });
    }
};
