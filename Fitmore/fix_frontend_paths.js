const fs = require('fs');
const path = require('path');

const publicUserDir = path.join(__dirname, 'public/user');
let logOutput = "";

function processFile(filePath) {
    if (fs.statSync(filePath).isDirectory()) {
        const files = fs.readdirSync(filePath);
        for (const file of files) {
            processFile(path.join(filePath, file));
        }
        return;
    }

    const ext = path.extname(filePath);
    if (!['.html', '.js'].includes(ext)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix HTML links, scripts, css, images
    if (ext === '.html') {
        content = content.replace(/(href|src)=["'](?!http|\/|#|mailto:|javascript:)(.*?)["']/gi, (match, attr, val) => {
            return `${attr}="/user/${val}"`;
        });
        
        content = content.replace(/window\.location\.href\s*=\s*["'](?!http|\/|#|mailto:)(.*?)["']/g, (match, val) => {
            return `window.location.href="/user/${val}"`;
        });
        
        content = content.replace(/window\.location\.href\s*=\s*`(?!http|\/|#|mailto:)(.*?)`/g, (match, val) => {
            return `window.location.href=\`/user/${val}\``;
        });

        content = content.replace(/window\.location\s*=\s*["'](?!http|\/|#|mailto:)(.*?)["']/g, (match, val) => {
            return `window.location="/user/${val}"`;
        });
    }

    // Fix JS files
    if (ext === '.js') {
        content = content.replace(/window\.location\.href\s*=\s*["'](?!http|\/|#|mailto:)(.*?)["']/g, (match, val) => {
            return `window.location.href="/user/${val}"`;
        });
        
        content = content.replace(/window\.location\.href\s*=\s*`(?!http|\/|#|mailto:)(.*?)`/g, (match, val) => {
            return `window.location.href=\`/user/${val}\``;
        });

        content = content.replace(/['"]images\/no-image\.png['"]/g, "'/user/images/no-image.png'");
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        
        logOutput += `\nFile: ${path.relative(__dirname, filePath)}\n`;
        const origLines = original.split('\n');
        const newLines = content.split('\n');
        const len = Math.max(origLines.length, newLines.length);
        for (let i = 0; i < len; i++) {
            const ol = origLines[i] || '';
            const nl = newLines[i] || '';
            if (ol !== nl) {
                logOutput += `- ${ol.trim()}\n+ ${nl.trim()}\n`;
            }
        }
    }
}

processFile(publicUserDir);
const finalLog = logOutput.trim();
fs.writeFileSync('path_diffs.txt', finalLog);
console.log('Path routing fixed!');
