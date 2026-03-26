const fs = require('fs');

let content = fs.readFileSync('public/user/product.html', 'utf8');

// 1. Add currentProductStock
content = content.replace(
    'const productId = params.get("id");',
    'let currentProductStock = 0;\n        const productId = params.get("id");'
);

// 2. Fix Stock Display
content = content.replace(
    /document\.getElementById\("stockStatus"\)\.innerText\s*=\s*product\.stock \? "In Stock" : "Out of Stock";/s,
    `currentProductStock = product.stock || 0;
            const stockEl = document.getElementById("stockStatus");
            const addToCartBtn = document.getElementById("addToCartBtn");
            const qtyInputEl = document.getElementById("qtyInput");
            
            if (currentProductStock > 0) {
                stockEl.innerText = currentProductStock + " in Stock";
                stockEl.style.color = "#00C851"; 
                if(addToCartBtn) {
                    addToCartBtn.disabled = false;
                    addToCartBtn.innerText = "Buy Now";
                    addToCartBtn.style.opacity = "1";
                    addToCartBtn.style.cursor = "pointer";
                }
                if(qtyInputEl) qtyInputEl.value = 1;
            } else {
                stockEl.innerText = "Out of Stock";
                stockEl.style.color = "var(--accent)"; 
                if(addToCartBtn) {
                    addToCartBtn.disabled = true;
                    addToCartBtn.innerText = "Out of Stock";
                    addToCartBtn.style.opacity = "0.5";
                    addToCartBtn.style.cursor = "not-allowed";
                }
                if(qtyInputEl) qtyInputEl.value = 0;
            }`
);

// 3. Fix Quantity Input
content = content.replace(
    /window\.changeQty\s*=\s*function\s*\(change\)\s*{\s*let val = parseInt\(qtyInput\.value\) \+ change;\s*if\s*\(val < 1\)\s*val = 1;\s*qtyInput\.value = val;\s*};/s,
    `window.changeQty = function (change) {
            if (currentProductStock <= 0) return;
            
            let currentVal = parseInt(qtyInput.value) || 1;
            let val = currentVal + change;
            
            if (val < 1) val = 1;
            
            if (val > currentProductStock) {
                val = currentProductStock;
                if (typeof errorAlert !== 'undefined') {
                    errorAlert("Only " + currentProductStock + " items available in stock");
                } else {
                    alert("Only " + currentProductStock + " items available in stock");
                }
            }
            
            qtyInput.value = val;
        };
        
        if (qtyInput) {
            qtyInput.addEventListener('change', (e) => {
                let val = parseInt(e.target.value) || 1;
                if (currentProductStock <= 0) {
                    val = 0;
                } else if (val < 1) {
                    val = 1;
                } else if (val > currentProductStock) {
                    val = currentProductStock;
                    if (typeof errorAlert !== 'undefined') {
                        errorAlert("Only " + currentProductStock + " items available in stock");
                    }
                }
                e.target.value = val;
            });
        }`
);

fs.writeFileSync('public/user/product.html', content, 'utf8');
console.log('Stock logic injected');
