const ContactMessage = require('../../models/ContactMessage');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newContact = new ContactMessage({
            name,
            email,
            subject,
            message
        });

        await newContact.save();

        res.status(201).json({ success: true, message: 'Message sent successfully.' });
    } catch (err) {
        console.error('Contact Submission Error:', err);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};
