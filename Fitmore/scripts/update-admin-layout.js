const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// 1. Remove admin-profile link from sidebar
const profileBlockRegex = /\s*<div class="menu-category">Config<\/div>\s*<div class="nav-item"( active)? onclick="window\.location\.href='admin-profile\.html'">[\s\S]*?<\/svg>\s*<\/div>\s*Admin Profile\s*<\/div>/g;

// 2. Add onclick to avatar
const avatarRegex1 = /<img src="https:\/\/images\.unsplash\.com[^"]+"[^>]*alt="Avatar"[^>]*class="avatar-top"[^>]*>/g;
const avatarReplacement1 = `<img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" alt="Avatar" class="avatar-top" onclick="window.location.href='admin-role.html'">`;

const avatarRegex2 = /<img src="[^"]*" alt="Avatar" class="avatar-top">/g;
const avatarReplacement2 = `<img src="https://ui-avatars.com/api/?name=Admin&background=333&color=fff" alt="Avatar" class="avatar-top" onclick="window.location.href='admin-role.html'">`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Strip profile block
    if (profileBlockRegex.test(content)) {
        content = content.replace(profileBlockRegex, '');
        changed = true;
    }

    // Update avatar link to ensure it's clickable
    if (avatarRegex1.test(content) && !content.includes("onclick=\"window.location.href='admin-role.html'\"")) {
        content = content.replace(avatarRegex1, avatarReplacement1);
        changed = true;
    } else if (avatarRegex2.test(content) && !content.includes("onclick=\"window.location.href='admin-role.html'\"")) {
        content = content.replace(avatarRegex2, avatarReplacement2);
        changed = true;
    }
    
    // Catch-all for any avatar-top that doesn't have onclick yet
    if (content.includes('class="avatar-top"') && !content.includes("onclick=\"window.location.href='admin-role.html'\"")) {
        content = content.replace(/class="avatar-top"/g, `class="avatar-top" onclick="window.location.href='admin-role.html'"`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
}
