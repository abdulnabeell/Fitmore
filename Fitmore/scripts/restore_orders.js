const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'user', 'orders.html');
let content = fs.readFileSync(file, 'utf8');

const missingBlock = `                                        : "status-processing";

                                let actionButtonHTML = '';
                                if (order.status === "PLACED" || order.status === "CONFIRMED") {
                                    actionButtonHTML = \`<button class="btn-action btn-cancel" onclick="cancelOrder('\${order._id}')">Cancel Order</button>\`;
                                } else if (order.status === "SHIPPED" || order.status === "OUT_FOR_DELIVERY") {
                                    actionButtonHTML = \`<button class="btn-action" style="background:#FFA500;color:black" onclick="trackOrder('\${order._id}')">Track Order</button>\`;
                                } else if (order.status === "DELIVERED") {
                                    actionButtonHTML = \`<button class="btn-action btn-cancel" onclick="openReturnModal('\${order._id}')">Return Order</button>\`;
                                } else if (order.status === "RETURN_REQUESTED") {
                                    actionButtonHTML = \`<button class="btn-action btn-cancel" disabled style="opacity:0.5;cursor:not-allowed;">Return Requested</button>\`;
                                } else if (order.status === "RETURNED") {
                                    actionButtonHTML = \`<button class="btn-action btn-cancel" disabled style="opacity:0.5;cursor:not-allowed;">Returned</button>\`;
                                }

                                const itemsHTML = order.items.map(item => \`
                <div class="order-items">
                    <div class="item-thumb">
                        <img src="\${item.image}">
                    </div>
                    <div class="item-details">
                        <span class="item-name">\${item.name}</span>
                        <span class="item-meta">
                            Qty: \${item.qty}
                        </span>
                    </div>
                    <div style="font-weight:600;">
                        $\${item.price}
                    </div>
                </div>
            \`).join("");

                                return \`
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">
                                <a href="order-details.html?id=\${order._id}">
                                    Order #\${order._id.slice(-6)}
                                </a>
                            </div>
                            <div class="order-date">
                                \${new Date(order.createdAt).toDateString()}
                            </div>
                        </div>
                        <span class="order-status \${statusClass}">
                            \${formatStatus(order.status)}
                        </span>
                    </div>

                    \${itemsHTML}

                    <div class="order-footer">
                        <div>
                            <button class="btn-action btn-invoice"
                                onclick="downloadInvoice(
                                    '\${order._id}',
                                    '\${order.items[0].name}',
                                    '\${order.total}',
                                    '\${order.items[0].qty}'
                                )">
                                Download Invoice
                            </button>
                            \${actionButtonHTML}
                        </div>
                        <div class="order-total">
                            Total: $\${order.total}
                        </div>
                    </div>
                </div>
            \`;

                            }).join("");

                        } catch (err) {
                            console.error("Order Load Error:", err);
                        }
                    }

                    loadOrders();


                    /* ===============================
                       INVOICE GENERATION
                    =============================== */

                    function downloadInvoice(orderId, item, price, qty) {

                        const { jsPDF } = window.jspdf;
                        const doc = new jsPDF();

                        doc.setFontSize(22);
                        doc.text("INVOICE", 105, 20, null, null, "center");

                        doc.setFontSize(12);
                        doc.text(\`Order ID: #\${orderId}\`, 20, 40);
                        doc.text(\`Date: \${new Date().toLocaleDateString()}\`, 20, 50);

                        doc.line(20, 70, 190, 70);

                        doc.text("Item", 20, 80);
                        doc.text("Qty", 120, 80);
                        doc.text("Price", 160, 80);

                        doc.setFont("helvetica", "bold");
                        doc.text(item, 20, 90);
                        doc.setFont("helvetica", "normal");
                        doc.text(qty, 120, 90);
                        doc.text(\`$\${price}\`, 160, 90);

                        const total =
                            (parseFloat(price) * parseInt(qty)).toFixed(2);

                        doc.line(20, 100, 190, 100);

                        doc.setFont("helvetica", "bold");
                        doc.text(\`Total: $\${total}\`, 140, 110);

                        doc.save(\`Invoice_\${orderId}.pdf\`);
                    }


                    /* ===============================
                       CANCEL ORDER
                    =============================== */

                    function cancelOrder(orderId) {

                        confirmAlert(
                            \`Cancel Order #\${orderId}?\`,
                            async () => {

                                await fetch(
                                    \`http://localhost:5000/api/orders/\${orderId}/cancel\`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: \`Bearer \${token}\`
                                        }
                                    }
                                );

                                successAlert("Order Cancelled");

                                loadOrders();
                            }
                        );
                    }

                    /* ===============================
                       TRACK ORDER
                    =============================== */

                    function trackOrder(orderId) {
                        successAlert("Order is currently in transit! Tracking #183749303");
                    }
                    
                    /* ===============================
                       RETURN MODAL
                    =============================== */

                    let currentReturnOrderId = null;
                    const modal = document.getElementById("returnModal");

                    function openReturnModal(orderId) {
                        currentReturnOrderId = orderId;
                        modal.classList.add("active");
                    }

                    function closeReturnModal() {
                        modal.classList.remove("active");
                        currentReturnOrderId = null;
                    }

                    function submitReturn() {

                        const reason =
                            document.getElementById("returnReason").value;
                            
                        const notes =
                            document.getElementById("returnNotes").value;

                        if (!reason) {
                            errorAlert("Select return reason");
                            return;
                        }

                        // Send the return request with reason to the backend
                        fetch(\`/api/orders/\${currentReturnOrderId}/return\`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: \`Bearer \${token}\`
                            },
                            body: JSON.stringify({
                                returnReason: reason,
                                returnNotes: notes
                            })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Return request failed");
                            }
                            return response.json();
                        })
                        .then(data => {
                            successAlert(\`Return requested for Order #\${currentReturnOrderId.slice(-6)}\`);
                            closeReturnModal();
                            loadOrders();
                        })
                        .catch(err => {
                            console.error(err);
                            errorAlert("Failed to submit return request");
                            closeReturnModal();
                        });
                    }

                    // Fetch User Profile Data for Header`;

content = content.replace(
    /\s*:\s*"status-processing";[\s\S]*?\/\/ Fetch User Profile Data for Header/,
    missingBlock
);

fs.writeFileSync(file, content);
console.log("Restored missing code successfully!");
