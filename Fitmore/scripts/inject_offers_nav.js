const fs = require('fs');
const path = require('path');
const adminDir = './public/admin';

const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

const offerNav = `
        <div class="nav-item" onclick="window.location.href='offers.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
            </div>
            Offers
        </div>`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(adminDir, file), 'utf8');

    if (content.indexOf("Offers</div>") !== -1 && file !== 'offers.html') {
        console.log("Skipping " + file);
        return;
    }

    if (file !== 'offers.html') {
        content = content.replace(/(Brand\\s*<\\/div>)/, "$1" + offerNav);
    } else {
        // Special active handling just for offers.html
        content = content.replace(/class="nav-item active"/g, 'class="nav-item"');
        const searchActive = \`onclick="window.location.href='offers.html'"\`;
        const replaceActive = \`onclick="window.location.href='offers.html'" class="nav-item active"\`;
        content = content.replace(searchActive, replaceActive);
    }

    fs.writeFileSync(path.join(adminDir, file), content);
    console.log("Updated " + file);
});
