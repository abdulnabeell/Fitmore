
const publishBtn = document.getElementById("publishBtn");
let productImages = [];
let isEditMode = false;
let productId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  productId = urlParams.get('id');

  await fetchCategories();

  if (productId) {
    isEditMode = true;
    publishBtn.innerText = 'Update Product';
    document.querySelector('.page-title').innerText = 'Edit Product';
    document.querySelector('.header-left h2').innerText = 'Edit Existing Product';
    fetchProductDetails(productId);
  }
});

// Fetch Product Details for Edit
async function fetchProductDetails(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    const product = await response.json();

    if (response.ok) {
      document.getElementById("name").value = product.name;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;
      document.getElementById("category").value = product.category;

      if (product.images && product.images.length > 0) {
        productImages = product.images;
        const preview = document.getElementById('previewImage');
        const placeholder = document.getElementById('noImagePlaceholder');
        preview.src = product.images[0];
        preview.style.display = 'block';
        placeholder.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    Swal.fire('Error', 'Failed to load product details', 'error');
  }
}

// Fetch Categories
async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5000/api/categories?mode=admin', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const categories = await response.json();

    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Select your product category</option>';

    if (Array.isArray(categories)) {
      categories.forEach(cat => {
        if (cat.status !== 'Hidden') {
          const option = document.createElement('option');
          option.value = cat.name;
          option.textContent = cat.name;
          categorySelect.appendChild(option);
        }
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Handle Image Upload
function handleImageUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64 = e.target.result;
      productImages[0] = base64;

      const preview = document.getElementById('previewImage');
      const placeholder = document.getElementById('noImagePlaceholder');

      preview.src = base64;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// Publish/Update Product
publishBtn.addEventListener("click", async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire('Error', 'You must be logged in to perform this action', 'error');
    return;
  }

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;

  if (!name || !description || !price || !category) {
    Swal.fire('Warning', 'Please fill in all required fields', 'warning');
    return;
  }

  const productData = {
    name,
    description,
    price: Number(price),
    category,
    images: productImages,
    stock: 100
  };

  try {
    publishBtn.disabled = true;
    publishBtn.innerText = isEditMode ? 'Updating...' : 'Publishing...';

    const url = isEditMode ? `http://localhost:5000/api/products/${productId}` : "http://localhost:5000/api/products";
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Operation failed');
    }

    Swal.fire({
      icon: 'success',
      title: isEditMode ? 'Product Updated!' : 'Product Published!',
      text: isEditMode ? 'Your product has been updated successfully.' : 'Your product has been added successfully.',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = 'product-list.html';
    });

  } catch (err) {
    console.error(err);
    Swal.fire('Error', err.message, 'error');
  } finally {
    publishBtn.disabled = false;
    publishBtn.innerText = isEditMode ? 'Update Product' : 'Publish Product';
  }
});

window.handleImageUpload = handleImageUpload;


// Since handleImageUpload is called from HTML, allow it to be global or attached to window
window.handleImageUpload = handleImageUpload;
