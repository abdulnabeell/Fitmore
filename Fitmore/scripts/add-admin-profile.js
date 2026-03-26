const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'admin');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'admin-profile.html');

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Look for the exact Admin Role div block in the sidebar
    // We can use a regex that matches the div containing Admin Role
    const regex = /(<div class="nav-item"\s+onclick="window\.location\.href='admin-role\.html'">[\s\S]*?<\/div>)/;
    
    if (regex.test(content)) {
        // Only append if it doesn't already have admin-profile
        if (!content.includes('admin-profile.html')) {
            const replacement = `$1

        <div class="menu-category">Config</div>
        <div class="nav-item" onclick="window.location.href='admin-profile.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            Admin Profile
        </div>`;
            content = content.replace(regex, replacement);
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${file}`);
        } else {
            console.log(`Already contains admin profile: ${file}`);
        }
    } else {
        console.log(`Could not find admin role block in ${file}`);
    }
}
