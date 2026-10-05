const API_URL = "http://127.0.0.1:5000/api/products";


// Load all products
async function loadProducts() {

    try {

        const response = await fetch(API_URL);
        const products = await response.json();

        displayProducts(products);
        updateDashboard(products);

    } catch (error) {

        showMessage("Unable to connect to backend.", true);

        console.error(error);
    }
}


// Display products in table
function displayProducts(products) {

    const table = document.getElementById("productTable");

    table.innerHTML = "";

    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }

    products.forEach(product => {

        const lowStock = product.quantity <= 5;

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${product.product_id}</td>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>${product.quantity}</td>

            <td>₹${product.price.toFixed(2)}</td>

            <td class="${lowStock ? "low-stock" : "in-stock"}">
                ${lowStock ? "Low Stock" : "In Stock"}
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editProduct('${product.product_id}', ${product.quantity}, ${product.price})">
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteProduct('${product.product_id}')">
                    Delete
                </button>

            </td>
        `;

        table.appendChild(row);
    });
}


// Update dashboard
function updateDashboard(products) {

    document.getElementById("totalProducts").textContent =
        products.length;

    const lowStockCount =
        products.filter(product => product.quantity <= 5).length;

    document.getElementById("lowStock").textContent =
        lowStockCount;

    const totalValue =
        products.reduce(
            (total, product) =>
                total + product.quantity * product.price,
            0
        );

    document.getElementById("inventoryValue").textContent =
        "₹" + totalValue.toFixed(2);
}


// Add product
document
    .getElementById("productForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const product = {

            product_id:
                document.getElementById("productId").value,

            name:
                document.getElementById("productName").value,

            category:
                document.getElementById("category").value,

            quantity:
                Number(document.getElementById("quantity").value),

            price:
                Number(document.getElementById("price").value)
        };


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(product)
            });


            const result = await response.json();


            if (!response.ok) {

                showMessage(result.error, true);
                return;
            }


            showMessage(
                "Product added successfully!"
            );


            this.reset();

            loadProducts();


        } catch (error) {

            showMessage(
                "Unable to connect to backend.",
                true
            );
        }

    });


// Search products
async function searchProducts() {

    const query =
        document.getElementById("searchInput").value.trim();


    if (!query) {

        loadProducts();
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/search?q=${encodeURIComponent(query)}`
        );

        const products = await response.json();

        displayProducts(products);
        updateDashboard(products);

    } catch (error) {

        showMessage(
            "Search failed.",
            true
        );
    }
}


// Delete product
async function deleteProduct(productId) {

    const confirmed =
        confirm(`Delete product ${productId}?`);


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${productId}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            showMessage(result.error, true);
            return;
        }


        showMessage(
            "Product deleted successfully!"
        );

        loadProducts();


    } catch (error) {

        showMessage(
            "Unable to delete product.",
            true
        );
    }
}


// Edit product
async function editProduct(productId, oldQuantity, oldPrice) {

    const quantity =
        prompt(
            "Enter new quantity:",
            oldQuantity
        );


    if (quantity === null) {
        return;
    }


    const price =
        prompt(
            "Enter new price:",
            oldPrice
        );


    if (price === null) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${productId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    quantity: Number(quantity),

                    price: Number(price)

                })
            }
        );


        const result = await response.json();


        if (!response.ok) {

            showMessage(result.error, true);
            return;
        }


        showMessage(
            "Product updated successfully!"
        );

        loadProducts();


    } catch (error) {

        showMessage(
            "Unable to update product.",
            true
        );
    }
}


// Display messages
function showMessage(message, error = false) {

    const messageBox =
        document.getElementById("message");

    messageBox.textContent = message;

    messageBox.style.marginBottom = "15px";

    messageBox.style.fontWeight = "bold";

    messageBox.style.color =
        error ? "#dc2626" : "#16a34a";
}


// Initial load
loadProducts();