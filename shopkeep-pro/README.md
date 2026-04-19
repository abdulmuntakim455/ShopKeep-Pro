# React + Vite

ShopKeep Pro 📦
ShopKeep Pro is a robust, full-stack MERN (MongoDB, Express, React, Node.js) Shop Management and Point of Sale (POS) system. Designed for small to medium-sized retail businesses, it digitizes daily operations including inventory tracking, billing, credit management (Khaata), and business analytics.

📦 Installation & Setup
1. Backend Setup

Bash

cd server

npm install

#Create a .env file with MONGODB_URI and PORT=5000

node index.js

2. Frontend Setup

Bash

npm install

npm run dev

🚀 Key Features

Real-time Dashboard: Track Total Revenue, Estimated Profit, and outstanding Credit (Udhaar) at a glance.

Inventory Management: Full CRUD operations for products with automated Low Stock and Expiry Date alerts.

Digital POS (Point of Sale): Intuitive cart system with multi-mode payment support (Cash, UPI, Card, Credit).

Automated Stock Deduction: Real-time synchronization between sales and inventory levels via MongoDB.

Khaata Ledger: Dedicated module to manage customer credit and track outstanding balances.

Professional Invoicing: Generate and download structured text-based bills for customers.

Reporting: Export sales registry and inventory data to CSV for external accounting.

Role Management: Toggle between Owner Mode (Full access + Profit analytics) and Staff Mode (Operations only).

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, Lucide-React

Backend: Node.js, Express.js

Database: MongoDB (Atlas/Local)

State Management: React Hooks (useState, useEffect, useMemo)

API: RESTful API with Fetch