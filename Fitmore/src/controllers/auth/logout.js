exports.logout = (req, res) => {
    res.clearCookie('userToken');
    res.clearCookie('adminToken');
    res.json({ success: true, message: "Logged out successfully" });
};
