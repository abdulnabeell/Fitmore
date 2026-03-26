const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'user', 'orders.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /onclick="returnOrder\('\${order\._id}'\)">Return Order<\/button>/g,
    `onclick="openReturnModal('\${order._id}')">Return Order</button>`
);

const oldSubmitReturn = `
                    function submitReturn() {

                        const reason =
                            document.getElementById("returnReason").value;

                        if (!reason) {
                            errorAlert("Select return reason");
                            return;
                        }

                        successAlert(
                            \`Return requested for Order #\${currentReturnOrderId}\`
                        );

                        closeReturnModal();
                        // Initialize pagination
                        renderPagination();
                    }
`;

const newSubmitReturn = `
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
`;

// It might be easier to use regex since exact whitespace could differ
content = content.replace(/function submitReturn\(\) \{[\s\S]*?renderPagination\(\);\s*\}/, newSubmitReturn.trim());

fs.writeFileSync(file, content);
console.log("returns fixed in orders.html");
