const ContactMessage = require('../../models/ContactMessage');

exports.getContacts = async (req, res) => {
    try {
        // Fetch all contact messages, sorted by most recent first
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        console.error('Error fetching contact messages:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error: Could not retrieve messages' 
        });
    }
};
