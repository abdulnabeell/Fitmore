const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

const correctReturnNav = `
        <div class="nav-item" onclick="window.location.href='returns.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path>
                    <path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path>
                </svg>
            </div>
            Return Requests
        </div>`;

const returnActiveNavTemplate = `
        <div class="nav-item active" onclick="window.location.href='returns.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path>
                    <path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path>
                </svg>
            </div>
            Return Requests
        </div>`;

// This regex finds the Coupon Code block
const couponRegex = /(<div class="nav-item(?: active)?"(?: onclick="[^"]*")?>\s*<div class="nav-icon">\s*<svg class="icon" viewBox="0 0 24 24">\s*<rect x="3" y="11" width="18" height="11" rx="2" ry="2"><\/rect>\s*<path d="M7 11V7a5 5 0 0 1 10 0v4"><\/path>\s*<\/svg>\s*<\/div>\s*Coupon Code\s*<\/div>)/g;

// This regex finds the malformed or existing active Return Requests block
const existingReturnRegex = /<div class="nav-item(?: active)?"(?: onclick="[^"]*")?>\s*<div class="nav-icon">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>\s*Return Requests\s*<\/div>/g;

let updatedFiles = 0;

for (const file of files) {
    const filePath = path.join(adminDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if the current file is returns.html to give it the active class
    const navTextToInsert = (file === 'returns.html') ? returnActiveNavTemplate : correctReturnNav;

    // First remove any existing Return Requests block
    let newContent = content.replace(existingReturnRegex, '');

    // Now insert the correct block right before the Coupon Code block
    newContent = newContent.replace(couponRegex, `${navTextToInsert}\n$1`);

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${file}`);
        updatedFiles++;
    }
}

console.log(`Finished processing. Updated ${updatedFiles} files.`);
