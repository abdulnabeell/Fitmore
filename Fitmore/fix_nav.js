const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'user');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Move id="signupLink" from <a> to <li>
    // Old: <li><a href="signup.html" class="nav-item" id="signupLink">SIGN UP</a></li>
    // New: <li id="signupLink"><a href="signup.html" class="nav-item">SIGN UP</a></li>
    // Note: some files might have slightly different spacing, so we use regex

    content = content.replace(
        /<li>\s*<a href="signup\.html" class="nav-item" id="signupLink">SIGN UP<\/a>\s*<\/li>/g,
        '<li id="signupLink" class="nav-item" style="list-style: none;"><a href="signup.html" class="nav-item">SIGN UP</a></li>'
    );

    // Some files might have `class="nav-item active"` etc but signup link won't be active usually.

    // Also we need to make sure the CSS `.nav-item.hidden` in index and shop html covers the new `li.nav-item.hidden`
    // Wait, the new li has class="nav-item". So the CSS `.nav-item.hidden` WILL apply to it!
    // And `.style.display = 'none'` applied to id="signupLink" will hide the `<li>` because the id is now on the `<li>`.

    fs.writeFileSync(filePath, content);
});

console.log('Fixed signuplink wrapper across all HTML files.');
