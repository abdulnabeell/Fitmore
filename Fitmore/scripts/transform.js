const fs = require('fs');

try {
    let html = fs.readFileSync('./public/admin/offers.html', 'utf8');

    // General text replacements
    html = html.replace(/Brands/g, 'Offers');
    html = html.replace(/Brand/g, 'Offer');
    html = html.replace(/brand/g, 'offer');
    html = html.replace(/All Offerss/g, 'All Offers');
    html = html.replace(/Add Offer/g, 'Create Offer');
    html = html.replace('<th>Logo</th>', '<th>Banner</th>');
    html = html.replace('<th>Offer Name</th>', '<th>Promotion Info</th>');
    html = html.replace('<th>Status (Active)</th>', '<th>Discount</th>\\n                            <th>Status</th>');

    const oldForm = `<div class="form-group">
                    <label class="form-label" for="offerName">Offer Name</label>
                    <input type="text" id="offerName" class="form-input" placeholder="e.g. Nike" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="offerImageUrl">Offer Logo URL</label>
                    <input type="url" id="offerImageUrl" class="form-input" placeholder="https://example.com/logo.png" required oninput="previewUrl(this.value)">
                </div>`;

    const newForm = `<div class="form-group">
                    <label class="form-label" for="offerTitle">Offer Title</label>
                    <input type="text" id="offerTitle" class="form-input" placeholder="e.g. Summer Slam Sale" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="offerDescription">Description</label>
                    <input type="text" id="offerDescription" class="form-input" placeholder="e.g. Get 20% off on Whey Protein" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="offerDiscount">Discount Percentage (%)</label>
                    <input type="number" id="offerDiscount" class="form-input" placeholder="e.g. 20" min="0" max="100" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="offerImageUrl">Banner Image URL</label>
                    <input type="url" id="offerImageUrl" class="form-input" placeholder="https://unsplash..." required oninput="previewUrl(this.value)">
                </div>`;
    html = html.replace(oldForm, newForm);

    html = html.replace("const API_URL = '/api/offers/admin';", "const API_URL = '/api/admin/offers';");
    html = html.replace("const response = await fetch(`${API_URL}/all`", "const response = await fetch(`${API_URL}`");
    html = html.replace("const url = isEditing ? `${API_URL}/${id}` : `${API_URL}/create`;", "const url = isEditing ? `${API_URL}/${id}` : `${API_URL}`;");
    
    // Fix search filter
    html = html.replace('renderOffers(offers.filter(b => b.name.toLowerCase().includes(term)));', 'renderOffers(offers.filter(o => o.title.toLowerCase().includes(term)));');

    html = html.replace('<td><img src="${offer.imageUrl}" class="cat-img" alt="${offer.name}" style="object-fit:contain; background:#fff; padding:4px;"></td>', '<td><img src="${offer.imageUrl}" class="cat-img" style="object-fit:cover; width:80px; padding:0;"></td>');
    html = html.replace('<td><h4>${offer.name}</h4></td>', '<td><h4>${offer.title}</h4><p>${offer.description}</p></td>\\n                    <td><span style="background:var(--accent);color:white;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:bold;">${offer.discountPercentage || 0}% OFF</span></td>');

    html = html.replace(`document.getElementById('offerName').value = offer.name;`, `document.getElementById('offerTitle').value = offer.title;
            document.getElementById('offerDescription').value = offer.description;
            document.getElementById('offerDiscount').value = offer.discountPercentage;`);

    html = html.replace(`const name = document.getElementById('offerName').value.trim();`, `const title = document.getElementById('offerTitle').value.trim();
            const description = document.getElementById('offerDescription').value.trim();
            const discountPercentage = document.getElementById('offerDiscount').value;`);
    html = html.replace(`JSON.stringify({ name, imageUrl, isActive })`, `JSON.stringify({ title, description, discountPercentage, imageUrl, isActive })`);

    // Fix double script bracket
    html = html.replace('<<script src="js/admin-auth.js"></script>', '<script src="js/admin-auth.js"></script>');

    fs.writeFileSync('./public/admin/offers.html', html);
    console.log('Successfully transformed offers.html');
} catch (e) {
    console.error(e);
}
