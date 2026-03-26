const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ADMIN\\OneDrive\\Documents\\Badge\\fitmore-html\\Fitmore\\public\\user';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Non-greedy capture div.search-container completely to its matching closing tag
const searchContainerRegex = /<div class="search-container"[\s\S]*?<\/div>\s*<\/div>/i;
// But wait, the original one was:
// <div class="search-container" ...>
//    <button>...</button>
//    <input ...>
// </div>
// So this regex will grab it perfectly:
const searchContainerBetterRegex = /<div class="search-container"[\s\S]*?<\/div>/i;

const scriptRegex = /<script>\s*\/\* =====================================\s*GLOBAL SEARCH LOGIC\s*=====================================\*\/[\s\S]*?<\/script>/i;

const newSearchHTML = `
                <div class="search-container" style="position: relative; display: flex; align-items: center;">
                    <button class="icon-btn desktop-only" id="globalSearchBtn" onclick="toggleGlobalSearch(event)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <input type="text" id="globalSearchInput" autocomplete="off" placeholder="Search products, brands..." onkeypress="handleGlobalSearch(event)" oninput="handleSearchInput(event)" style="position: absolute; right: 100%; top: 50%; transform: translateY(-50%); width: 0; opacity: 0; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.85); color: white; outline: none; transition: width 0.3s ease, opacity 0.3s ease; pointer-events: none; z-index: 1000;">
                    
                    <!-- Dropdown for live suggestions -->
                    <div id="searchSuggestions" style="position: absolute; top: calc(100% + 15px); right: 0; width: 320px; background: #151515; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); z-index: 1001; display: none; overflow: hidden;">
                        <div id="suggestionsContent" style="max-height: 400px; overflow-y: auto;"></div>
                    </div>
                </div>`;

const jsLogic = `<script>
        /* =====================================
           GLOBAL SEARCH LOGIC V2 (Live Suggestions)
        =====================================*/
        function toggleGlobalSearch(e) {
            e.preventDefault();
            const input = document.getElementById('globalSearchInput');
            const dropdown = document.getElementById('searchSuggestions');
            if (input.style.opacity === '0' || input.style.width === '0px') {
                input.style.width = '280px';
                input.style.opacity = '1';
                input.style.pointerEvents = 'auto';
                input.focus();
            } else {
                if(input.value.trim() !== '') {
                    window.location.href = 'shop.html?search=' + encodeURIComponent(input.value.trim());
                } else {
                    input.style.width = '0px';
                    input.style.opacity = '0';
                    input.style.pointerEvents = 'none';
                    if (dropdown) dropdown.style.display = 'none';
                    input.blur();
                }
            }
        }

        function handleGlobalSearch(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const input = document.getElementById('globalSearchInput');
                if(input.value.trim() !== '') {
                    window.location.href = 'shop.html?search=' + encodeURIComponent(input.value.trim());
                }
            }
        }

        let searchTimeout = null;
        async function handleSearchInput(e) {
            const query = e.target.value.trim();
            const dropdown = document.getElementById('searchSuggestions');
            const content = document.getElementById('suggestionsContent');

            if (query.length < 2) {
                dropdown.style.display = 'none';
                return;
            }

            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                dropdown.style.display = 'block';
                content.innerHTML = '<div style="padding: 15px; text-align: center; color: #888; font-size: 0.9rem;">Searching <span style="color:#FFF">"'+query+'"</span>...</div>';
                
                try {
                    const res = await fetch('/api/products?search=' + encodeURIComponent(query) + '&limit=5');
                    const products = await res.json();
                    
                    if (!products || products.length === 0) {
                        content.innerHTML = '<div style="padding: 15px; text-align: center; color: #888; font-size: 0.9rem;">No matches found.</div>';
                        return;
                    }

                    // Extract unique categories (acting as brands/categories suggestion)
                    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
                    
                    let html = '';
                    
                    // Categories / Brands Section
                    if (uniqueCategories.length > 0) {
                        html += '<div style="padding: 8px 15px; font-size: 0.75rem; text-transform: uppercase; color: #E50914; font-weight: bold; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); letter-spacing: 1px;">Categories / Brands</div>';
                        uniqueCategories.forEach(cat => {
                            html += \`<a href="shop.html?category=\${encodeURIComponent(cat)}" style="display: block; padding: 12px 15px; color: #fff; text-decoration: none; font-size: 0.95rem; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px; vertical-align: middle; color: #888;">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                \${cat}
                            </a>\`;
                        });
                    }

                    // Products Section
                    html += '<div style="padding: 8px 15px; font-size: 0.75rem; text-transform: uppercase; color: #E50914; font-weight: bold; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); letter-spacing: 1px;">Products</div>';
                    products.forEach(p => {
                        const imgsrc = p.image || (p.images && p.images[0]) || 'images/no-image.png';
                        html += \`<a href="product.html?id=\${p._id}" style="display: flex; align-items: center; padding: 12px 15px; color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <img src="\${imgsrc}" style="width: 45px; height: 45px; object-fit: contain; background: #fff; border-radius: 6px; margin-right: 15px;">
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-size: 0.95rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${p.name}</div>
                                <div style="font-size: 0.85rem; color: #E50914; font-weight: 600; margin-top: 4px;">₹\${p.price}</div>
                            </div>
                        </a>\`;
                    });

                    content.innerHTML = html;
                } catch (err) {
                    content.innerHTML = '<div style="padding: 15px; text-align: center; color: #E50914; font-size: 0.9rem;">Error fetching results.</div>';
                }
            }, 300);
        }
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const container = e.target.closest('.search-container');
            const dropdown = document.getElementById('searchSuggestions');
            if (dropdown && !container) {
                dropdown.style.display = 'none';
            }
        });
    </script>`;

let modifiedCount = 0;
files.forEach(f => {
    const p = path.join(dir, f);
    let content = fs.readFileSync(p, 'utf8');

    if (scriptRegex.test(content) && searchContainerBetterRegex.test(content)) {
        content = content.replace(searchContainerBetterRegex, newSearchHTML);
        content = content.replace(scriptRegex, jsLogic);
        fs.writeFileSync(p, content, 'utf8');
        modifiedCount++;
        console.log("Upgraded V1 to V2 in " + f);
    }
});
console.log("Total files upgraded: " + modifiedCount);
