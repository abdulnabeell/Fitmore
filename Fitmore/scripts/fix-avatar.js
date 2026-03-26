const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));


for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const exactMatch = 'class="avatar-top"';
    // Let's replace only if it doesn't already have the onclick next to it
    // A simple regex: replace class="avatar-top" (optionally followed by >)
    let updatedContent = content.replace(/class="avatar-top"\s*>/g, `class="avatar-top" style="cursor: pointer;" onclick="window.location.href='admin-role.html'">`);
    
    // Also cover the case where there is no > right after
    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Fixed avatar link in ${file}`);
    }
}
