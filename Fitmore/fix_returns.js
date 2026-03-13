const fs = require('fs');
const path = require('path');

const ordersFile = path.join(__dirname, 'public', 'admin', 'orders.html');
const returnsFile = path.join(__dirname, 'public', 'admin', 'returns.html');

let content = fs.readFileSync(ordersFile, 'utf8');

// Update Title and active nav
content = content.replace(/<title>Order Management \| FITMORE Admin<\/title>/, '<title>Return Requests | FITMORE Admin</title>');
content = content.replace(/<div class="nav-item active" onclick="window\.location\.href='orders\.html'">([\s\S]*?)<\/div>/, '<div class="nav-item" onclick="window.location.href=\'orders.html\'">$1</div>');
content = content.replace(/<div class="nav-item">([\s\S]*?)Return Requests<\/div>/, '<div class="nav-item active">Return Requests</div>'); // Wait, Return Requests wasn't in orders.html sidebar... Let's check the sidebar in orders.html.

// Oh, let's just do a manual string replace for the sidebar item. 
// "Transaction" is there. Let's add "Return Requests" under Order Management if it is missing, or just make Order Management inactive.

// Actually, in orders.html, let's replace:
// <div class="page-title">Order Management</div>
content = content.replace(/<div class="page-title">Order Management<\/div>/, '<div class="page-title">Return Requests</div>');

// Replace standard stats grid and table with returns specific
const statsGridRegex = /<!-- Stats -->[\s\S]*?<!-- Table Container -->/;
const tableContainerRegex = /<!-- Table Container -->[\s\S]*?<\/main>/;

const newStatsGrid = `
            <!-- Stats -->
            <section class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
                <article class="stat-card">
                    <div class="stat-header">
                        <div>Total Return Requests</div>
                    </div>
                    <div class="stat-main">
                        <span class="stat-val" id="stat-total">0</span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-header">
                        <div>Pending Returns</div>
                    </div>
                    <div class="stat-main">
                        <span class="stat-val" id="stat-pending">0</span>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-header">
                        <div>Approved Returns</div>
                    </div>
                    <div class="stat-main">
                        <span class="stat-val" id="stat-approved">0</span>
                    </div>
                </article>
            </section>
`;

const newTableContainer = `
            <!-- Table Container -->
            <section class="orders-container">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Order Id</th>
                                <th>Product</th>
                                <th>Date Requested</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="returnsTableBody">
                            <!-- Rows rendered dynamically -->
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </main>
`;

content = content.replace(statsGridRegex, newStatsGrid);
content = content.replace(tableContainerRegex, newTableContainer);

const newScript = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            fetchReturns();
        });

        let returnOrders = [];

        async function fetchReturns() {
            try {
                const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

                if (!token) {
                    window.location.href = 'admin-login.html';
                    return;
                }

                const response = await fetch('/api/orders/admin/all', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                
                // Filter only return requested & returned
                returnOrders = (data.orders || []).filter(o => o.status === 'RETURN_REQUESTED' || o.status === 'RETURNED');
                
                updateDashboardStats();
                renderReturns(returnOrders);
            } catch (err) {
                console.error(err);
                alert("Could not load return requests");
            }
        }

        function updateDashboardStats() {
            const total = returnOrders.length;
            const pending = returnOrders.filter(o => o.status === 'RETURN_REQUESTED').length;
            const approved = returnOrders.filter(o => o.status === 'RETURNED').length;

            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-pending').textContent = pending;
            document.getElementById('stat-approved').textContent = approved;
        }

        function renderReturns(orders) {
            const tbody = document.getElementById('returnsTableBody');
            tbody.innerHTML = '';

            if (orders.length === 0) {
                tbody.innerHTML = \`<tr><td colspan="7" style="text-align: center; padding: 2rem;">No return requests found</td></tr>\`;
                return;
            }

            orders.forEach((order, index) => {
                const requestDate = new Date(order.updatedAt || order.createdAt).toLocaleDateString();
                
                let productCellHtml = '';
                if (order.items && order.items.length > 0) {
                    const firstItem = order.items[0];
                    productCellHtml = \`
                        <div class="product-cell">
                            <img src="\${firstItem.image || 'https://via.placeholder.com/50'}" class="product-img" alt="Product">
                            <span>\${firstItem.name} \${order.items.length > 1 ? \`(+\${order.items.length - 1} more)\` : ''}</span>
                        </div>
                    \`;
                }

                const isPending = order.status === 'RETURN_REQUESTED';
                const statusBadge = isPending 
                    ? '<span class="status-badge" style="background:#fff7ed; color:#c2410c; padding:4px 8px; border-radius:4px;">Pending</span>'
                    : '<span class="status-badge" style="background:#ecfdf5; color:#047857; padding:4px 8px; border-radius:4px;">Returned</span>';

                const actionHtml = isPending 
                    ? \`<button onclick="processReturn('\${order._id}', 'approve')" style="background:#10b981; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">Approve</button>
                       <button onclick="processReturn('\${order._id}', 'reject')" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Reject</button>\`
                    : \`<span style="color:#6b7280; font-size:0.85rem;">Processed</span>\`;

                const tr = document.createElement('tr');
                tr.innerHTML = \`
                    <td>\${index + 1}</td>
                    <td>#ORD-\${order._id.substring(0, 6).toUpperCase()}</td>
                    <td>\${productCellHtml}</td>
                    <td>\${requestDate}</td>
                    <td>Customer requested return</td>
                    <td>\${statusBadge}</td>
                    <td>\${actionHtml}</td>
                \`;
                tbody.appendChild(tr);
            });
        }

        async function processReturn(orderId, action) {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const newStatus = action === 'approve' ? 'RETURNED' : 'DELIVERED'; // Rejecting sets it back to Delivered
            
            const confirmMsg = action === 'approve' ? "Approve this return?" : "Reject this return request?";
            if(!confirm(confirmMsg)) return;

            try {
                const response = await fetch(\`/api/orders/admin/\${orderId}/status\`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': \`Bearer \${token}\`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    throw new Error("Failed to process return");
                }

                // Update local status
                const orderIndex = returnOrders.findIndex(o => o._id === orderId);
                if (orderIndex !== -1) {
                    returnOrders[orderIndex].status = newStatus;
                }
                
                updateDashboardStats();
                renderReturns(returnOrders);
                alert(\`Return request \${action}d successfully\`);

            } catch (err) {
                console.error(err);
                alert("Failed to process return request");
            }
        }
    </script>
</body>
</html>
`;

content = content.replace(/<script>[\s\S]*?<\/html>/, newScript);

fs.writeFileSync(returnsFile, content);
console.log("returns.html updated successfully!");
