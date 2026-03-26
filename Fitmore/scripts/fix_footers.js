const fs = require('fs');
const path = require('path');

const UNIFIED_FOOTER = `
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="f-col">
                    <a href="index.html" class="logo" style="margin-bottom:1rem">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            style="color: var(--accent)">
                            <path d="M6 10H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3"></path>
                            <path d="M8 10v10"></path>
                            <path d="M16 10v10"></path>
                        </svg>
                        FITMORE
                    </a>
                    <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6">The premium destination for
                        serious athletes. Quality supplements, gym gear, and expert advice.</p>
                    <div class="f-socials">
                        <a href="#" class="soc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg></a>
                        <a href="#" class="soc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg></a>
                        <a href="#" class="soc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                                </path>
                            </svg></a>
                    </div>
                </div>

                <div class="f-col">
                    <h4>Support</h4>
                    <ul class="f-links">
                        <li><a href="contact.html">Help Center</a></li>
                        <li><a href="orders.html">Track Order</a></li>
                        <li><a href="contact.html">Returns & Refunds</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>

                <div class="f-col">
                    <h4>Shop</h4>
                    <ul class="f-links">
                        <li><a href="shop.html?category=protein">Protein</a></li>
                        <li><a href="shop.html?category=creatine">Creatine</a></li>
                        <li><a href="shop.html?category=pre-workout">Pre-Workout</a></li>
                        <li><a href="shop.html?category=vitamins-health">Vitamins & Health</a></li>
                    </ul>
                </div>

                <div class="f-col">
                    <h4>Company</h4>
                    <ul class="f-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="about.html">Careers</a></li>
                        <li><a href="index.html">Blog</a></li>
                        <li><a href="contact.html">Affiliate Program</a></li>
                    </ul>
                </div>
            </div>

            <div class="copyright">
                <p>&copy; 2026 Fitmore Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
`;

const dir = path.join(__dirname, 'public', 'user');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the old comment and footer
    const newContent = content.replace(/(<!--\s*Footer\s*-->\s*)?<footer\b[^>]*>[\s\S]*?<\/footer>/i, UNIFIED_FOOTER);

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated footer in ${file}`);
    } else {
        console.log(`No footer tag found in ${file}`);
    }
});
