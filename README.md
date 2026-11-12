# 🛒 GrocerGo — Complete Professional Full-Stack Grocery Platform

GrocerGo is a complete, production-grade grocery ordering platform engineered specifically for rural and semi-urban communities across India. Built with clean separation of concerns, it connects two distinct frontend portals to a unified TypeScript REST API backend and SQLite/Prisma persistent database.

---

## 🌟 Key Highlights & Architecture

| Application | URL | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Customer Portal** | [http://localhost:5173](http://localhost:5173) | React 18, Vite, TypeScript, Tailwind CSS, i18next, Web Speech API | Browse 20 categories, 100 groceries, voice search/assistant, cart, checkout & QR payment proof submission |
| **Admin Dashboard** | [http://localhost:5174](http://localhost:5174) | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts | Products CRUD, categories, live inventory tracking, order status workflow, manual payment verification, CSV export, audit logs |
| **Backend API** | [http://localhost:5000/api](http://localhost:5000/api) | Node.js, Express, TypeScript, Prisma ORM, SQLite, Multer, Zod, JWT | Unified REST API, atomic transactions, RBAC auth, file uploads, stock reservation, audit logging |

---

## 🔐 Default Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@grocergo.com` | `Admin@123` | Full administrative control (`http://localhost:5174`) |
| **Customer** | `customer@grocergo.com` | `Customer@123` | Customer ordering & tracking (`http://localhost:5173`) |

---

## 🚀 Quick Start Guide

### 1. Launch All Services (One-Click)
Double-click `start-all.bat` in the project root. This will launch:
- Backend API on port `5000`
- Customer Website on port `5173`
- Admin Website on port `5174`

### 2. Manual Commands
Run individual applications via terminal:

```bash
# Backend (Port 5000)
cd backend
npm run dev

# Customer Frontend (Port 5173)
cd customer-frontend
npm run dev

# Admin Frontend (Port 5174)
cd admin-frontend
npm run dev
```

### 3. Run Test Suite
```bash
cd backend
npm run test
```
All 21 backend integration & unit tests will run and verify auth, catalogue, ordering, and payment privacy.

---

## 📦 Catalogue & Seeded Data

GrocerGo comes pre-seeded with **20 categories** and **100 realistic Indian grocery items** (5 items per category):
1. **Fruits** (Shimla Apples, Robusta Bananas, Alphonso Mangoes, Nagpur Oranges, Pomegranate)
2. **Vegetables** (Nashik Onions, Hybrid Tomatoes, Potatoes, Fresh Ginger, Green Chillies)
3. **Rice and grains** (Ponni Boiled Rice, Sona Masoori Rice, Basmati Rice, Idli Rice, Brown Rice)
4. **Pulses and dals** (Toor Dal, Moong Dal, Chana Dal, Urad Dal, Masoor Dal)
5. **Flour and atta** (Chakki Fresh Atta, Maida, Rava / Sooji, Besan, Rice Flour)
6. **Cooking oil and ghee** (Sunflower Oil, Pure Cow Ghee, Groundnut Oil, Mustard Oil, Gingelly Oil)
7. **Milk and dairy** (Toned Fresh Milk, Curd / Dahi, Fresh Paneer, Salted Butter, Dairy Whitener)
8. **Bread and bakery** (Whole Wheat Bread, White Bread, Milk Rusk, Fruit Cake, Pav Buns)
9. **Eggs** (Farm Fresh White Eggs 6s, 12s, Country Brown Eggs, Organic Free Range, Quail Eggs)
10. **Snacks and biscuits** (Marie Gold, Bourbon Biscuits, Roasted Peanuts, Murukku / Chakli, Potato Chips)
11. **Tea and coffee** (Chai CTC Tea Powder, Filter Coffee Powder, Green Tea, Instant Coffee, Masala Chai)
12. **Sugar, salt, and spices** (Refined Sugar, Iodized Crystal Salt, Turmeric Powder, Red Chilli Powder, Coriander Powder)
13. **Packaged foods** (Instant 2-Min Noodles, Roasted Vermicelli, Poha / Flattened Rice, Tomato Ketchup, Instant Pasta)
14. **Beverages** (Mango Drink, Lemon Drink Concentrate, Tender Coconut Water, Rose Sharbat, Badam Milk Mix)
15. **Personal care** (Bathing Soap 3-Pack, Herbal Shampoo, Toothpaste, Coconut Hair Oil, Hand Sanitizer)
16. **Household cleaning** (Detergent Washing Powder, Dishwash Liquid Gel, Floor Cleaner, Toilet Cleaner, Bleach Liquid)
17. **Baby care** (Baby Diaper Pants M, Gentle Baby Wipes, Baby Soap Bar, Baby Massage Oil, Baby Cereal)
18. **Frozen foods** (Frozen Green Peas, French Fries, Frozen Sweet Corn, Veg Spring Rolls, Samosa Pack)
19. **Daily essentials** (Matchbox Bundle, Mosquito Repellent Coil, Camphor Tablets, Incense Agarbatti, Cotton Wicks)
20. **Meat and seafood** (Curry Cut Fresh Chicken, Boneless Chicken Breast, Fresh Rohu Fish, Mutton Curry Cut, Fresh Prawns)

---

## 🇮🇳 Multilingual Translations

Full localized UI in **6 Indian Languages**:
- **English** (`en`)
- **Tamil** (`ta` — தமிழ்)
- **Hindi** (`hi` — हिन्दी)
- **Telugu** (`te` — తెలుగు)
- **Kannada** (`kn` — ಕನ್ನಡ)
- **Malayalam** (`ml` — മലയാളം)

The language switcher in the customer topbar instantly switches navigation, product details, checkout, status badges, and voice assistant responses.

---

## 🎙️ Web Speech Voice Assistant

Click the floating microphone button on the Customer Website to issue natural voice commands:
- *"Show vegetables"* — Filters to the vegetables category
- *"Find Ponni rice"* — Searches and displays matching products
- *"Add two tomatoes"* — Finds item and adds quantity to cart
- *"Open my cart"* — Navigates directly to `/cart`
- *"What is my order status?"* — Reads latest order status aloud
- *"Change language to Tamil"* — Switches interface language

---

## 💳 Manual UPI QR Payment Flow

> **No third-party payment gateway keys required.**

1. Customer proceeds to checkout and places order.
2. An atomic database transaction reserves stock and generates a unique order reference (e.g. `GG-20261029-XXXXXX`).
3. Customer is presented with the admin-configured dynamic UPI QR Code and instructions.
4. Customer scans QR via PhonePe, Google Pay, Paytm, or BHIM and submits screenshot + UTR reference.
5. Order enters `Proof Submitted` / `Under Verification` state.
6. Admin views payment proof securely at `http://localhost:5174/payments`.
7. Admin verifies or rejects with notes. On approval, order moves to `Confirmed` and proceeds through delivery pipeline (`Preparing` ➔ `Ready for Pickup` ➔ `Out for Delivery` ➔ `Delivered`).
8. If an order is cancelled, stock is automatically and atomically restored to inventory.
