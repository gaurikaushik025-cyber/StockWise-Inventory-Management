# StockWise – Inventory Management System

## Project Description

StockWise is a web-based Inventory Management System developed as part of a Teacher Assessment. The application allows users to manage product inventory through a simple and user-friendly web interface.

Users can add, view, search, update and delete products. The system also calculates total inventory value and identifies products with low stock.

## Features

- Add new products
- View all products
- Search products by ID, name or category
- Edit product details
- Delete products
- Low-stock detection
- Total product count
- Total inventory value calculation
- Input validation
- Duplicate Product ID validation
- SQLite database
- REST API using Flask

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Database
- SQLite

### Development Tools
- Visual Studio Code
- Git
- GitHub

## Project Structure

```text
StockWise/
│
├── .gitignore
├── README.md
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── inventory.db
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
    How to Run the Project
1. Open the project
Open the StockWise folder in Visual Studio Code.
2. Open the backend terminal
cd backend

3. Create a virtual environment
python -m venv venv

4. Activate the virtual environment
For Windows:
venv\Scripts\activate

5. Install required packages
pip install -r requirements.txt

6. Start the Flask backend
python app.py

The backend will run at:
http://127.0.0.1:5000

7. Start the frontend
Open:
frontend/index.html

using VS Code Live Server.
The frontend will normally open at:
http://127.0.0.1:5500/frontend/index.html

API Endpoints
Method	Endpoint	Description
GET	/api/products	Get all products
POST	/api/products	Add a product
GET	/api/products/search?q=	Search products
PUT	/api/products/<id>	Update a product
DELETE	/api/products/<id>	Delete a product


Low Stock Detection
Products with a quantity of 5 or less are displayed with a Low Stock status.
Validation
The application validates product information such as:
- Required fields
- Product ID uniqueness
- Non-negative quantity
- Non-negative price
Database
StockWise uses SQLite to store product inventory data.
Author
Gauri Kaushik
Roll no. : 18
Electronics and Communication Engineering(M2)