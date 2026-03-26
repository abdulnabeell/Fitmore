const fs = require('fs');
let content = fs.readFileSync('public/user/product.html', 'utf8');

// 1. Fix the "Write a Review" button (remove the flex class)
content = content.replace(
    /<button class="btn-add auth-required" id="writeReviewBtn"[\s\S]*?onClick="toggleReviewForm\(\)".*?>Write a\s*Review<\/button>/i,
    `<button class="auth-required" id="writeReviewBtn" style="background: var(--accent); color: white; border: none; font-weight: 600; border-radius: 4px; padding: 10px 24px; cursor: pointer; text-transform: uppercase; font-size: 0.9rem;" onclick="toggleReviewForm()">Write a Review</button>`
);

// Fallback in case spacing differs
if (!content.includes('font-size: 0.9rem;" onclick="toggleReviewForm()">Write a Review')) {
    content = content.replace(
        /<button class="btn-add auth-required" id="writeReviewBtn"[\s\S]*?<\/button>/,
        `<button class="auth-required" id="writeReviewBtn" style="background: var(--accent); color: white; border: none; font-weight: 600; border-radius: 4px; padding: 10px 24px; cursor: pointer; text-transform: uppercase; font-size: 0.9rem;" onclick="toggleReviewForm()">Write a Review</button>`
    );
}

// 2. Remove the entire "Flash Sales" section
content = content.replace(
    /\s*<!-- Flash Sales -->\s*<div class="flash-section">[\s\S]*?<div class="flash-slider" id="flashSlider">\s*<!-- Items rendered via JS -->\s*<\/div>\s*<\/div>/,
    ''
);

fs.writeFileSync('public/user/product.html', content, 'utf8');
console.log('Product UI cleanup completed');
