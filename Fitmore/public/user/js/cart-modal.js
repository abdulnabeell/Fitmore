document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the HTML for the Cart Modal
    const modalHtml = `
        <div class="auth-modal" style="background: var(--bg-card); padding: 2rem; border-radius: 8px; max-width: 400px; width: 90%; text-align: center; border: 1px solid rgba(255,255,255,0.1); position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
            <h2 id="cartModalTitle" style="font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--text-white);">Success</h2>
            <p id="cartModalMessage" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Item added to cart successfully.</p>
            <div class="auth-btns" style="display: flex; flex-direction: column; gap: 10px;">
                <a href="/user/cart.html" class="btn" style="background: var(--accent); color: white; padding: 12px; border-radius: 4px; text-decoration: none; font-weight: 600; transition: opacity 0.3s ease;">View Cart</a>
                <button class="btn-outline" id="closeCartModalBtn" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 12px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;">Continue Shopping</button>
            </div>
        </div>
    `;

    // 2. Inject it into the body
    if (!document.getElementById('cartSuccessModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'auth-modal-overlay';
        modalContainer.id = 'cartSuccessModal';
        modalContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;';
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);

        // Inject the CSS class styles
        const style = document.createElement('style');
        style.textContent = `
            #cartSuccessModal.active {
                opacity: 1 !important;
                pointer-events: auto !important;
            }
            #cartSuccessModal.active .auth-modal {
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 3. Attach Event Listeners
    const cartSuccessModal = document.getElementById('cartSuccessModal');
    const closeCartModalBtn = document.getElementById('closeCartModalBtn');

    window.closeCartModal = function() {
        if(cartSuccessModal) cartSuccessModal.classList.remove('active');
    };

    if(closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', window.closeCartModal);
    }

    if(cartSuccessModal) {
        cartSuccessModal.addEventListener('click', e => {
            if (e.target === cartSuccessModal) window.closeCartModal();
        });
    }
});
