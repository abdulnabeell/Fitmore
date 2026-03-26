const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'public', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

const correctSidebarContent = `
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="logo">FITMORE</div>

        <div class="menu-category">Main menu</div>
        <div class="nav-item {{DASHBOARD_ACTIVE}}" onclick="window.location.href='dashboard.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </div>
            Dashboard
        </div>
        <div class="nav-item {{ORDERS_ACTIVE}}" onclick="window.location.href='orders.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </div>
            Order Management
        </div>
        <div class="nav-item {{CUSTOMERS_ACTIVE}}" onclick="window.location.href='customers.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            Customers
        </div>
        <div class="nav-item {{RETURNS_ACTIVE}}" onclick="window.location.href='returns.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path>
                    <path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path>
                </svg>
            </div>
            Return Requests
        </div>
        <div class="nav-item {{COUPONS_ACTIVE}}" onclick="window.location.href='coupons.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            Coupon Code
        </div>
        <div class="nav-item {{CATEGORIES_ACTIVE}}" onclick="window.location.href='categories.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            Categories
        </div>
        <div class="nav-item {{TRANSACTIONS_ACTIVE}}" onclick="window.location.href='transactions.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
            </div>
            Transaction
        </div>
        <div class="nav-item {{BRAND_ACTIVE}}">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                    </polygon>
                </svg>
            </div>
            Brand
        </div>

        <div class="menu-category">Product</div>
        <div class="nav-item {{ADD_PRODUCT_ACTIVE}}" onclick="window.location.href='add-product.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            </div>
            Add Products
        </div>
        <div class="nav-item {{PRODUCT_MEDIA_ACTIVE}}">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
            Product Media
        </div>
        <div class="nav-item {{PRODUCT_LIST_ACTIVE}}" onclick="window.location.href='product-list.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </div>
            Product List
        </div>
        <div class="nav-item {{REVIEWS_ACTIVE}}" onclick="window.location.href='reviews.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path
                        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                    </path>
                </svg>
            </div>
            Product Reviews
        </div>

        <div class="menu-category">Admin</div>
        <div class="nav-item {{ADMIN_ROLE_ACTIVE}}" onclick="window.location.href='admin-role.html'">
            <div class="nav-icon">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            Admin Role
        </div>

        <div class="user-profile">
            <img src="https://ui-avatars.com/api/?name=Dealport&background=333&color=fff" alt="User"
                class="user-avatar-sm">
            <div class="user-info">
                <h4>Dealport</h4>
                <p>Mark@thedesigner...</p>
            </div>
            <div class="logout-icon" onclick="
                localStorage.removeItem('token');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('role');
                window.location.href='/login.html';
            ">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </div>
        </div>

        <div
            style="margin-top: 1rem; padding: 0.75rem 1rem; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; color: #374151;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                </svg>
                Your Shop
            </div>
            <svg class="icon" style="width: 16px; height: 16px; color: #9ca3af;" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </div>

    </aside>
`;

const sidebarRegex = /<!--\s*Sidebar\s*-->\s*<aside class="sidebar" id="sidebar">[\s\S]*?<\/aside>/i;

let updatedFiles = 0;

for (const file of files) {
    const filePath = path.join(adminDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Inject active class mapping
    let generatedSidebar = correctSidebarContent
        .replace('{{DASHBOARD_ACTIVE}}', file === 'dashboard.html' ? 'active' : '')
        .replace('{{ORDERS_ACTIVE}}', file === 'orders.html' ? 'active' : '')
        .replace('{{CUSTOMERS_ACTIVE}}', file === 'customers.html' ? 'active' : '')
        .replace('{{RETURNS_ACTIVE}}', file === 'returns.html' ? 'active' : '')
        .replace('{{COUPONS_ACTIVE}}', file === 'coupons.html' ? 'active' : '')
        .replace('{{CATEGORIES_ACTIVE}}', file === 'categories.html' ? 'active' : '')
        .replace('{{TRANSACTIONS_ACTIVE}}', file === 'transactions.html' ? 'active' : '')
        .replace('{{BRAND_ACTIVE}}', file === 'brand.html' ? 'active' : '')
        .replace('{{ADD_PRODUCT_ACTIVE}}', file === 'add-product.html' ? 'active' : '')
        .replace('{{PRODUCT_MEDIA_ACTIVE}}', file === 'product-media.html' ? 'active' : '')
        .replace('{{PRODUCT_LIST_ACTIVE}}', file === 'product-list.html' ? 'active' : '')
        .replace('{{REVIEWS_ACTIVE}}', file === 'reviews.html' ? 'active' : '')
        .replace('{{ADMIN_ROLE_ACTIVE}}', file === 'admin-role.html' ? 'active' : '');

    // Remove extra trailing spaces inside class name when no active class
    generatedSidebar = generatedSidebar.replace(/class="nav-item "/g, 'class="nav-item"');

    if (sidebarRegex.test(content)) {
        let newContent = content.replace(sidebarRegex, generatedSidebar.trim());
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${file}`);
        updatedFiles++;
    } else {
        console.error(`ERROR: Sidebar block not found in ${file}`);
    }
}

console.log(`Finished processing. Updated ${updatedFiles} files.`);
