// async function loadProducts() {

//   const res = await fetch(
//     "http://localhost:5000/api/products"
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
      "http://localhost:5000/api/products"
    );

    const products = await res.json();

    const container =
      document.getElementById("productContainer");

    container.innerHTML = "";

    products.forEach(product => {

      container.innerHTML += `
        <div class="prod-card fade-in">

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

        </div>
      `;
    });

  } catch (error) {
    console.error("Product Load Error:", error);
  }
}

loadProducts();
