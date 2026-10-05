from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)

# Initialize database
init_db()


@app.route("/")
def home():
    return "StockWise Backend is Running!"


# GET all products
@app.route("/api/products", methods=["GET"])
def get_products():
    connection = get_db_connection()

    products = connection.execute(
        "SELECT * FROM products ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return jsonify([dict(product) for product in products])


# SEARCH products
@app.route("/api/products/search", methods=["GET"])
def search_products():
    query = request.args.get("q", "").strip()

    connection = get_db_connection()

    products = connection.execute(
        """
        SELECT * FROM products
        WHERE product_id LIKE ?
        OR name LIKE ?
        OR category LIKE ?
        ORDER BY id DESC
        """,
        (
            f"%{query}%",
            f"%{query}%",
            f"%{query}%"
        )
    ).fetchall()

    connection.close()

    return jsonify([dict(product) for product in products])


# ADD product
@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.get_json()

    product_id = data.get("product_id")
    name = data.get("name")
    category = data.get("category")
    quantity = data.get("quantity")
    price = data.get("price")

    # Required field validation
    if not all([product_id, name, category]) or quantity is None or price is None:
        return jsonify({
            "error": "All fields are required"
        }), 400

    # Quantity validation
    if quantity < 0:
        return jsonify({
            "error": "Quantity cannot be negative"
        }), 400

    # Price validation
    if price < 0:
        return jsonify({
            "error": "Price cannot be negative"
        }), 400

    connection = get_db_connection()

    try:
        connection.execute(
            """
            INSERT INTO products
            (product_id, name, category, quantity, price)
            VALUES (?, ?, ?, ?, ?)
            """,
            (product_id, name, category, quantity, price)
        )

        connection.commit()

    except Exception:
        connection.close()

        return jsonify({
            "error": "Product ID already exists"
        }), 409

    connection.close()

    return jsonify({
        "message": "Product added successfully"
    }), 201
# UPDATE product
@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()

    quantity = data.get("quantity")
    price = data.get("price")

    if quantity is None or price is None:
        return jsonify({
            "error": "Quantity and price are required"
        }), 400

    if quantity < 0:
        return jsonify({
            "error": "Quantity cannot be negative"
        }), 400

    if price < 0:
        return jsonify({
            "error": "Price cannot be negative"
        }), 400

    connection = get_db_connection()

    existing_product = connection.execute(
        "SELECT * FROM products WHERE product_id = ?",
        (product_id,)
    ).fetchone()

    if existing_product is None:
        connection.close()
        return jsonify({
            "error": "Product not found"
        }), 404

    connection.execute(
        """
        UPDATE products
        SET quantity = ?, price = ?
        WHERE product_id = ?
        """,
        (quantity, price, product_id)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Product updated successfully"
    })
# DELETE product
@app.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    connection = get_db_connection()

    existing_product = connection.execute(
        "SELECT * FROM products WHERE product_id = ?",
        (product_id,)
    ).fetchone()

    if existing_product is None:
        connection.close()
        return jsonify({
            "error": "Product not found"
        }), 404

    connection.execute(
        "DELETE FROM products WHERE product_id = ?",
        (product_id,)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Product deleted successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)