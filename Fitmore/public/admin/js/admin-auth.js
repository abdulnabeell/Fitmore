// admin-auth.js
// Protect admin pages from unauthorized access

(function () {

    const adminToken = localStorage.getItem("adminToken");
    const role = localStorage.getItem("role");

    // If token missing or role is not admin → redirect
    if (!adminToken || role !== "admin") {

        console.warn("Unauthorized access to admin panel");

        // Clear possible corrupted data
        localStorage.removeItem("adminToken");
        localStorage.removeItem("role");

        // Redirect to login page
        window.location.replace("../user/login.html");

        return;
    }

    // Optional: log success for debugging
    console.log("Admin authenticated");

})();

// Global Admin Logout Function
window.adminLogout = async function() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
        console.error("Logout error", err);
    }
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    window.location.replace("../user/login.html");
};