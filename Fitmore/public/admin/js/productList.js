
const productTableBody = document.getElementById('productTableBody');
const noDataMessage = document.getElementById('noDataMessage');
const searchInput = document.getElementById('searchProduct');

let allProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Fetch Products
async function fetchProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        allProducts = Array.isArray(data) ? data : (data.products || []);
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire('Error', 'Failed to load products', 'error');
    }
}

// Render Products
function renderProducts(products) {
    productTableBody.innerHTML = '';

    if (products.length === 0) {
        noDataMessage.style.display = 'block';
        return;
    }

    noDataMessage.style.display = 'none';

    products.forEach(product => {
        const row = document.createElement('tr');

        // Stock Badge Logic
        let stockClass = 'stock-in';
        let stockText = `${product.stock} in Stock`;
        if (product.stock === 0) {
            stockClass = 'stock-out';
            stockText = 'Out of Stock';
        } else if (product.stock < 10) {
            stockClass = 'stock-low';
            stockText = 'Low Stock';
        }

        // Status Badge Logic (Assuming model has status or defaulting to Published)
        const status = product.status || 'Published';
        const statusClass = status.toLowerCase() === 'published' ? 'status-published' : 'status-draft';

        row.innerHTML = `
            <td>
                <div class="product-cell">
                    <img src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/40'}" alt="Product" class="product-img">
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>SKU: ${product.sku || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td>${product.category || 'Uncategorized'}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="stock-badge ${stockClass}">${stockText}</span></td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" title="Edit" onclick="editProduct('${product._id}')">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" title="Delete" onclick="deleteProduct('${product._id}')">
                        <svg class="icon" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.sku && p.sku.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
    );
    renderProducts(filtered);
});

// Delete Product
async function deleteProduct(id) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4e73df',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire('Error', 'Failed to delete product', 'error');
        }
    }
}

// Edit Product Redirect
function editProduct(id) {
    window.location.href = `add-product.html?id=${id}`;
}
