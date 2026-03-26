const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'admin', 'transactions.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the stats values
content = content.replace(
    /\$15,045\s*<span class="trend-badge trend-up">↑ 14\.4%<\/span>/,
    '$<span id="revenue-stat">0</span>'
);
content = content.replace(
    /3,150\s*<span class="trend-badge trend-up">↑ 20%<\/span>/,
    '<span id="completed-stat">0</span>'
);
content = content.replace(
    /75\s*<span class="trend-badge trend-down">15%<\/span>/,
    '<span id="cancelled-stat">0</span>'
);
content = content.replace(
    /150\s*<span class="trend-badge trend-up" style="color:var\(--success-green\);">85%<\/span>/,
    '<span id="pending-stat">0</span>'
);

// Replace the table body
content = content.replace(
    /<tbody>[\s\S]*?<\/tbody>/,
    '<tbody id="transactionsTableBody"></tbody>'
);

// Inject the fetch script before generatePDF function
const fetchScript = `
        document.addEventListener('DOMContentLoaded', fetchTransactions);

        async function fetchTransactions() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login.html';
                    return;
                }

                const response = await fetch('/api/orders/admin/all', {
                    headers: { 'Authorization': \`Bearer \$\{token\}\` }
                });

                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                const orders = data.orders || [];

                let revenue = 0;
                let completed = 0;
                let cancelled = 0;
                let pending = 0;

                const tbody = document.getElementById('transactionsTableBody');
                tbody.innerHTML = '';

                orders.forEach(order => {
                    const status = order.status || 'Pending';
                    const isCancelled = status === 'Cancelled' || status === 'Returned';
                    const isCompleted = status === 'Delivered';

                    if (isCompleted) {
                        completed++;
                        if (order.paymentStatus === 'Paid') revenue += (order.totalAmount || 0);
                    } else if (isCancelled) {
                        cancelled++;
                    } else {
                        pending++;
                        if (order.paymentStatus === 'Paid') revenue += (order.totalAmount || 0);
                    }

                    const statusClass = isCancelled ? 'status-canceled' : (isCompleted ? 'status-complete' : 'status-pending');
                    const dotClass = isCancelled ? 'dot-canceled' : (isCompleted ? 'dot-complete' : 'dot-pending');

                    const amount = typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : '0.00';
                    const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                    const customer = order.user ? order.user.name : 'Guest';
                    const id = order._id ? order._id.substring(0,8).toUpperCase() : 'N/A';

                    const tr = document.createElement('tr');
                    tr.innerHTML = \`
                        <td>#\$\{id\}</td>
                        <td>\$\{customer\}</td>
                        <td>\$\{date\}</td>
                        <td>$\$\{amount\}</td>
                        <td>\$\{order.paymentMethod || 'COD'\}</td>
                        <td class="\$\{statusClass\}"><span class="status-dot \$\{dotClass\}"></span>\$\{status\}</td>
                        <td><a href="product-details.html?id=\$\{order._id\}" class="view-details-link">View Details</a></td>
                    \`;
                    tbody.appendChild(tr);
                });

                document.getElementById('revenue-stat').innerText = revenue.toFixed(2);
                document.getElementById('completed-stat').innerText = completed;
                document.getElementById('cancelled-stat').innerText = cancelled;
                document.getElementById('pending-stat').innerText = pending;
            } catch (err) {
                console.error(err);
                if(window.toastAlert) window.toastAlert('Error loading transactions');
            }
        }
`;

content = content.replace('function generatePDF() {', fetchScript + '\n        function generatePDF() {');

fs.writeFileSync(filePath, content);
console.log('Transactions page successfully patched!');
