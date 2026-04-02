// async function loadProducts() {

//   const res = await fetch(
//     "/api/products"
//   );

//   const products = await res.json();

//   const container =
//     document.getElementById("productContainer");

//   container.innerHTML = "";

//   products.forEach(p => {

//     container.innerHTML += `
//       <div class="product">
//         <img src="${p.image}" width="150"/>
//         <h3>${p.name}</h3>
//         <p>${p.description}</p>
//         <h4>₹${p.price}</h4>
//       </div>
//     `;
//   });
// }

// loadProducts();



async function loadProducts() {

  try {

    const res = await fetch(
      "/api/products"
    );

    const products = await res.json();

    const container =
      document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "prod-card fade-in";
      card.innerHTML = `
            <div class="prod-img-box">
                <img src="${product.images?.[0] || 'images/fallback.png'}">
            </div>

            <div class="prod-info">
                <h4>${product.name}</h4>
                <span class="prod-price">₹${product.price}</span>

                <button class="add-btn auth-required">
                    ADD TO CART
                </button>
            </div>
      `;

      const addBtn = card.querySelector(".add-btn");
      addBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
          alert('Please login to add items to the cart');
          window.location.href = '/user/login.html';
          return;
        }

        try {
          const token = localStorage.getItem('userToken');
          const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: product._id, quantity: 1 })
          });
          const data = await res.json();
          
          const modalTitle = document.getElementById('cartModalTitle');
          const modalMessage = document.getElementById('cartModalMessage');
          
          if (data.success || res.status === 200) {
            if(modalTitle) modalTitle.textContent = "Added to Cart!";
            if(modalTitle) modalTitle.style.color = "var(--text-white)";
            if(modalMessage) modalMessage.textContent = `${product.name} has been added to your cart.`;
            
            const cartCounts = document.querySelectorAll('.cart-count');
            cartCounts.forEach(el => {
              let count = parseInt(el.textContent) || 0;
              el.textContent = count + 1;
            });
          } else {
            if(modalTitle) modalTitle.textContent = "Error";
            if(modalTitle) modalTitle.style.color = "var(--accent)";
            if(modalMessage) modalMessage.textContent = data.message || "Failed to add product to cart.";
          }
          
          const cartModal = document.getElementById('cartSuccessModal');
          if (cartModal) cartModal.classList.add('active');
        } catch(err) {
          console.error('Error adding to cart', err);
        }
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Product Load Error:", error);
  }
}

loadProducts();
