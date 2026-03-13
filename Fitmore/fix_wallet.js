const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'user', 'payment-options.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Add razorpay checkout script
if (!content.includes('checkout.razorpay.com/v1/checkout.js')) {
    content = content.replace(
        '<script src="../js/alert.js"></script>',
        '<script src="../js/alert.js"></script>\n    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>'
    );
}

// 2. Replace the Mock Add Funds logic with the Razorpay flow
const scriptReplacement = `
        // Fetch Razorpay Key
        let rzpKey = '';
        async function fetchRazorpayKey() {
            try {
                const res = await fetch('/api/payment/config');
                const data = await res.json();
                if (data.success) {
                    rzpKey = data.key;
                }
            } catch (err) {
                console.error('Error fetching Razorpay config:', err);
            }
        }
        fetchRazorpayKey();

        // ----------------------------------------
        // GET WALLET DATA
        // ----------------------------------------
        async function loadWallet() {
            const token = localStorage.getItem('token');
            if(!token) return;
            try {
                const res = await fetch('/api/user/wallet', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                const data = await res.json();
                if (data.success) {
                    document.querySelector('.balance-amount h2').innerText = \`₹\${(data.walletBalance || 0).toFixed(2)}\`;
                    
                    const tbody = document.querySelector('.history-table tbody');
                    if (data.transactions && data.transactions.length > 0) {
                        tbody.innerHTML = data.transactions.map(t => {
                            const date = new Date(t.createdAt).toLocaleDateString();
                            const sign = t.type === 'credit' ? '+' : '-';
                            const color = t.type === 'credit' ? '#4CAF50' : '#F44336';
                            return \`
                                <tr>
                                    <td>\${date}</td>
                                    <td>\${t.description}</td>
                                    <td style="text-align: right; color: \${color}; font-weight: 600;">\${sign}₹\${t.amount.toFixed(2)}</td>
                                </tr>
                            \`;
                        }).join('');
                    } else {
                        tbody.innerHTML = \`<tr><td colspan="3"><span class="empty-state">No transactions yet.</span></td></tr>\`;
                    }
                }
            } catch (error) {
                console.error("Error loading wallet", error);
            }
        }
        
        document.addEventListener('DOMContentLoaded', loadWallet);

        // Razorpay Add Funds
        const btnAddFunds = document.querySelector('.btn-add-funds');
        if(btnAddFunds) {
            btnAddFunds.addEventListener('click', async () => {
                const amountInput = document.querySelector('.money-input').value;
                const amount = parseFloat(amountInput);

                if (isNaN(amount) || amount <= 0) {
                    return errorAlert('Please enter a valid amount greater than 0');
                }

                const token = localStorage.getItem('token');

                try {
                    // 1. Create order
                    const orderRes = await fetch('/api/payment/create-order', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': \`Bearer \${token}\`
                        },
                        body: JSON.stringify({ amount })
                    });

                    const orderData = await orderRes.json();
                    if (!orderData.success) {
                        return errorAlert(orderData.message || 'Error creating order');
                    }

                    // 2. Open Razorpay Widget
                    const options = {
                        key: rzpKey,
                        amount: orderData.order.amount,
                        currency: orderData.order.currency,
                        name: 'Fitmore Wallet',
                        description: 'Wallet Top-up',
                        order_id: orderData.order.id,
                        handler: async function (response) {
                            // 3. Verify Signature & Add funds
                            try {
                                const verifyRes = await fetch('/api/user/wallet/add', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': \`Bearer \${token}\`
                                    },
                                    body: JSON.stringify({
                                        amount: amount,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_signature: response.razorpay_signature
                                    })
                                });

                                const verifyData = await verifyRes.json();

                                if (verifyData.success) {
                                    successAlert(verifyData.message);
                                    document.querySelector('.money-input').value = '';
                                    loadWallet(); // Refresh UI
                                } else {
                                    errorAlert(verifyData.message || 'Payment verification failed');
                                }
                            } catch (err) {
                                console.error('Verify error', err);
                                errorAlert('Error processing payment confirmation');
                            }
                        },
                        theme: {
                            color: '#E50914'
                        }
                    };

                    const rzp = new Razorpay(options);
                    rzp.open();

                } catch (err) {
                    console.error('Checkout error:', err);
                    errorAlert('An error occurred during checkout');
                }
            });
        }
`;

// we just replace from "Mock Add Funds" down to just before Fetch User Profile Data for Header

const startRegex = /\/\/\s*Mock Add Funds/;
const endRegex = /\/\/\s*Fetch User Profile Data for Header/;

const matchStart = content.match(startRegex);
const matchEnd = content.match(endRegex);

if (matchStart && matchEnd) {
    const startIndex = matchStart.index;
    const endIndex = matchEnd.index;
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);

    fs.writeFileSync(file, before + scriptReplacement + "\n        " + after);
    console.log("Wallet Razorpay integration successful");
} else {
    console.log("Could not find start/end markers");
}
