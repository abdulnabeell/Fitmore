const fs = require('fs');
const path = require('path');
const dir = 'c:\\Users\\ADMIN\\OneDrive\\Documents\\Badge\\fitmore-html\\Fitmore\\public\\user';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const authScript = `
    <script>
        /* =====================================
           GLOBAL AUTH LOGIC (Hide Nav Items)
        =====================================*/
        document.addEventListener("DOMContentLoaded", () => {
            const token = localStorage.getItem("userToken");
            const signupLink = document.getElementById("signupLink");
            
            if (token) {
                if (signupLink) signupLink.style.display = "none";
                
                // Show protected icons (like profile or wishlist) if they have a 'auth-required' class that defaults to hidden
                document.querySelectorAll('.auth-required').forEach(el => {
                    el.style.display = 'inline-block'; // Or whatever their natural display is
                });
            } else {
                if (signupLink) signupLink.style.display = "block";
                
                // Hide protected icons if not logged in
                document.querySelectorAll('.auth-required').forEach(el => {
                    if (el.id !== 'userIconBtn') { // Prevent hiding main user icon if it handles login redirect
                        el.style.display = 'none';
                    }
                });
            }
        });
    </script>
</body>`;

let modifiedCount = 0;
files.forEach(f => {
    const p = path.join(dir, f);
    let content = fs.readFileSync(p, 'utf8');

    if (!content.includes('GLOBAL AUTH LOGIC')) {
        content = content.replace(/<\/body>/i, authScript);
        fs.writeFileSync(p, content, 'utf8');
        modifiedCount++;
    }
});
console.log("Total files injected: " + modifiedCount);
