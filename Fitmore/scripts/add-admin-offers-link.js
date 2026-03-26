const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'offers.html');

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // we will inject "Special Offers" navigation below "Coupon Code" navigation block which exists everywhere.
    // first identify Coupon Code block precisely
    const searchString = `        <div class="nav-item" onclick="window.location.href='coupons.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            Coupon Code
        </div>`;

    const searchStringActive = `        <div class="nav-item active" onclick="window.location.href='coupons.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            Coupon Code
        </div>`;

    const offersBlock = `
        <div class="nav-item" onclick="window.location.href='offers.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
            </div>
            Special Offers
        </div>`;

    if (!content.includes('Special Offers')) {
        let changed = false;
        if (content.includes(searchString)) {
            content = content.replace(searchString, searchString + offersBlock);
            changed = true;
        } else if (content.includes(searchStringActive)) {
            content = content.replace(searchStringActive, searchStringActive + offersBlock);
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Injected offers navigation link into ${file}`);
        } else {
            console.error(`Could not locate coupon block in ${file}`);
        }
    }
}
