const fs = require('fs');
let content = fs.readFileSync('public/user/product.html', 'utf8');

// 1. Add the warning div below actions-row
content = content.replace(
    /<\/button>\s*<\/div>\s*<!-- Info Box -->/,
    `</button>\n                    </div>\n                    <div id="qtyWarning" style="color: var(--accent); font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem; display: none; font-weight: 500; font-family: var(--font-main);"></div>\n\n                    <!-- Info Box -->`
);

// 2. Replace the errorAlert calls in the script with the inline text logic
// Use global replace if they exist multiple times
content = content.replace(
    /if \(typeof errorAlert !== 'undefined'\) \{\s*errorAlert\("Only " \+ currentProductStock \+ " items available in stock"\);\s*\} else \{\s*alert\("Only " \+ currentProductStock \+ " items available in stock"\);\s*\}/g,
    `const warnDiv = document.getElementById("qtyWarning");\n                if (warnDiv) {\n                    warnDiv.innerText = "Maximum limit of " + currentProductStock + " items reached.";\n                    warnDiv.style.display = "block";\n                    setTimeout(() => warnDiv.style.display = "none", 3000);\n                }`
);

content = content.replace(
    /if \(typeof errorAlert !== 'undefined'\) \{\s*errorAlert\("Only " \+ currentProductStock \+ " items available in stock"\);\s*\}/g,
    `const warnDiv = document.getElementById("qtyWarning");\n                    if (warnDiv) {\n                        warnDiv.innerText = "Maximum limit of " + currentProductStock + " items reached.";\n                        warnDiv.style.display = "block";\n                        setTimeout(() => warnDiv.style.display = "none", 3000);\n                    }`
);

fs.writeFileSync('public/user/product.html', content, 'utf8');
console.log('UI fix injected');
