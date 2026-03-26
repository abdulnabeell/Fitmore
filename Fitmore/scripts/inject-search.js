const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ADMIN\\OneDrive\\Documents\\Badge\\fitmore-html\\Fitmore\\public\\user';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldSearchRegex = /<button class="icon-btn desktop-only">\s*<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"\s*stroke-linecap="round" stroke-linejoin="round">\s*<circle cx="11" cy="11" r="8"><\/circle>\s*<line x1="21" y1="21" x2="16.65" y2="16.65"><\/line>\s*<\/svg>\s*<\/button>/is;

const newSearchHTML = `
                <div class="search-container" style="position: relative; display: flex; align-items: center;">
                    <button class="icon-btn desktop-only" id="globalSearchBtn" onclick="toggleGlobalSearch(event)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <input type="text" id="globalSearchInput" placeholder="Search..." onkeypress="handleGlobalSearch(event)" style="position: absolute; right: 100%; top: 50%; transform: translateY(-50%); width: 0; opacity: 0; padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.8); color: white; outline: none; transition: width 0.3s ease, opacity 0.3s ease; pointer-events: none;">
                </div>
`;

const jsLogic = `
    <script>
        /* =====================================
           GLOBAL SEARCH LOGIC
        =====================================*/
        function toggleGlobalSearch(e) {
            e.preventDefault();
            const input = document.getElementById('globalSearchInput');
            if (input.style.width === '0px' || !input.style.width || input.style.opacity === '0') {
                input.style.width = '200px';
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
        
        document.addEventListener('click', function(e) {
            const container = e.target.closest('.search-container');
            if (!container) {
                const input = document.getElementById('globalSearchInput');
                if (input && input.style.opacity === '1' && input.value.trim() === '') {
                    input.style.width = '0px';
                    input.style.opacity = '0';
                    input.style.pointerEvents = 'none';
                }
            }
        });
    </script>
`;

let modifiedCount = 0;
files.forEach(f => {
    const p = path.join(dir, f);
    let content = fs.readFileSync(p, 'utf8');

    if (oldSearchRegex.test(content)) {
        content = content.replace(oldSearchRegex, newSearchHTML);
        
        content = content.replace('</body>', jsLogic + '\\n</body>');
        fs.writeFileSync(p, content, 'utf8');
        modifiedCount++;
        console.log("Modified " + f);
    }
});
console.log("Total files modified: " + modifiedCount);
