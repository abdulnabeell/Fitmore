const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function replaceLocalhostFiles(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            replaceLocalhostFiles(fullPath);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace http://localhost:5000/api with /api
            const regex = /http:\/\/localhost:5000\/api/g;
            if (regex.test(content)) {
                content = content.replace(regex, '/api');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

console.log('Starting localhost replacement...');
replaceLocalhostFiles(publicDir);
console.log('Replacement complete.');
