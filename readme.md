<div align="center">

# 📦 StockSense

### Inventory Intelligence, Simplified

A modern, modular **Inventory Management System** built with React + Vite.  
Track products, manage receipts & deliveries, and monitor stock movements — all from a sleek dark-themed dashboard.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🚀 Live Demo

```
Login ID: admin1
Password: Admin@123
```

---

## ✨ Features

### 🔐 Authentication
- Login with credential validation
- Sign Up with rules — Login ID (6–12 chars, unique), Email (unique), Password (8+ chars, mixed case + special character)
- Forgot Password flow (simulated OTP reset)
- Session persistence via `localStorage`

### 📊 Dashboard
- **KPI Cards** — Total Products, Low Stock, Out of Stock, Total Movements
- **Operation Summary Cards** — Receipts & Deliveries with Late / Waiting / Ready breakdowns
- **Visual Progress Bars** — Segmented bars showing status distribution
- **Recent Movements Table** — Last 5 stock movements at a glance

### ⟳ Operations
| Module | Description |
|--------|-------------|
| **Receipts** (📥) | Incoming stock from vendors. Reference format: `WH/IN/XXXX` |
| **Deliveries** (📤) | Outgoing stock to customers. Reference format: `WH/OUT/XXXX` |

Each operation supports:
- **List View** — Searchable table with Reference, Contact, Date, Status
- **Kanban View** — Cards grouped by status columns (Draft → Waiting → Ready → Done)
- **Form View** — Full edit with product lines, contact selection, date, notes
- **Validation** — Mark as Done, auto-updates stock quantities & creates move history
- **Cancel / Delete** — With toast notifications

### 📦 Products
- **List View** — Table with Name, SKU, Category, Price, Stock, Status badges
- **Grid View** — Visual product cards with placeholder icons
- **CRUD Form** — Name, SKU, Category, UoM, Sales/Cost Price, Stock, Reorder Level
- **Stock Status** — In Stock (green) / Low (yellow) / Out of Stock (red) badges
- **Search** — Filter by product name or SKU

### ↕ Move History
- **Complete Ledger** — All stock movements with Reference, Date, Contact, From, To, Qty, Status
- **Color Coding** — Green border for IN (↓), Red border for OUT (↑)
- **Type Filters** — All / Incoming / Outgoing toggle buttons
- **Search** — By reference, product, or contact

### ⚙ Settings
- **Warehouse Management** — Add, edit, delete warehouses (Name, Short Code, Address)
- **Location Management** — Multi-level hierarchy (Internal / Input Zone / Output Zone) linked to warehouses

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Vanilla CSS (Dark Theme, Glassmorphism, Gradients) |
| **Data Storage** | localStorage (browser-based persistence) |
| **Font** | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |

---

## 📁 Project Structure

```
StockSense/
├── app/
│   ├── public/
│   │   └── favicon.svg                 # Gradient warehouse icon
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       ├── AppLayout.jsx        # Top nav + profile dropdown + <Outlet>
│   │   │       └── Layout.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Login / Signup / Logout + session persistence
│   │   │   └── ToastContext.jsx         # Toast notification system
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthPage.jsx         # Login / Signup / Forgot Password
│   │   │   │   └── Auth.css
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx        # KPI cards + ops cards + recent moves
│   │   │   │   └── Dashboard.css
│   │   │   ├── History/
│   │   │   │   ├── MoveHistory.jsx      # Stock movement ledger
│   │   │   │   └── History.css
│   │   │   ├── Operations/
│   │   │   │   ├── OperationsLayout.jsx # Tabs: Receipts | Deliveries
│   │   │   │   ├── OrderList.jsx        # Shared list/kanban/form component
│   │   │   │   ├── Receipts.jsx         # Incoming stock (WH/IN/*)
│   │   │   │   ├── Deliveries.jsx       # Outgoing stock (WH/OUT/*)
│   │   │   │   └── Operations.css
│   │   │   ├── Products/
│   │   │   │   ├── Products.jsx         # Product CRUD + list/grid views
│   │   │   │   └── Products.css
│   │   │   └── Settings/
│   │   │       ├── Settings.jsx         # Warehouse + Location management
│   │   │       └── Settings.css
│   │   ├── App.jsx                      # Router + Auth guard
│   │   ├── App.css
│   │   ├── index.css                    # Design system (tokens, utilities, resets)
│   │   ├── main.jsx                     # Entry point
│   │   └── utils.js                     # localStorage, ID gen, validation, seed data
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔧 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Sudhanshu-singh8448/stockSense_odoo.git
cd stockSense_odoo/app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-primary` | `#6C5CE7` | Primary actions, active states |
| `--brand-accent` | `#00CEC9` | Highlights, prices, accents |
| `--bg-base` | `#0A0A12` | Page background |
| `--bg-surface` | `#12121E` | Card/modal backgrounds |
| `--status-success` | `#00B894` | Done, In Stock |
| `--status-warning` | `#FDCB6E` | Waiting, Low Stock |
| `--status-danger` | `#FF6B6B` | Cancelled, Out of Stock |
| `--status-info` | `#74B9FF` | Ready |

### Design Features
- 🌑 **Dark Theme** — Easy on the eyes, perfect for warehouse/office use
- 🪟 **Glassmorphism** — `backdrop-filter: blur()` on cards and nav
- 🎨 **Gradient Accents** — Colored top borders, icon glows, button shimmer
- ✨ **Micro-Animations** — Float, pulse, slide-up, shimmer effects
- 📱 **Responsive** — Adapts to tablet and mobile viewports

---

## 📋 Inventory Workflow

```
                    ┌──────────┐
                    │  DRAFT   │
                    └────┬─────┘
                         │ Confirm
                    ┌────▼─────┐
                    │ WAITING  │
                    └────┬─────┘
                         │ Stock Available
                    ┌────▼─────┐
                    │  READY   │
                    └────┬─────┘
                         │ Validate
                    ┌────▼─────┐
                    │   DONE   │  ──→ Stock Updated + Move History Created
                    └──────────┘
```

| Operation | Effect on Stock |
|-----------|----------------|
| Receipt validated | **Increases** product quantity |
| Delivery validated | **Decreases** product quantity |
| Internal Transfer | Moves between locations (total unchanged) |
| Adjustment | Reconciles physical count vs system record |

---

## 🗂️ Data Model (localStorage)

| Key | Structure | Description |
|-----|-----------|-------------|
| `stocksense_users` | `[{id, loginId, email, password}]` | Registered users |
| `stocksense_currentUser` | `{id, loginId, email}` | Active session |
| `stocksense_products` | `[{id, name, sku, category, uom, salesPrice, costPrice, stock, reorderLevel}]` | Product catalog |
| `stocksense_receipts` | `[{id, reference, contact, scheduledDate, status, lines[], notes}]` | Incoming orders |
| `stocksense_deliveries` | `[{id, reference, contact, scheduledDate, status, lines[], notes}]` | Outgoing orders |
| `stocksense_moves` | `[{id, type, reference, date, contact, from, to, product, qty, status}]` | Movement ledger |
| `stocksense_warehouses` | `[{id, name, code, address}]` | Warehouse config |
| `stocksense_locations` | `[{id, warehouseId, name, type}]` | Location hierarchy |

---

## 👥 User Roles (as designed)

| Role | Description |
|------|-------------|
| **Inventory Manager** | Full access — CRUD on products, operations, settings |
| **Warehouse Staff** | Operational access — validate receipts/deliveries, view history |

> *Note: Role-based access is part of the design spec. The current implementation uses a single admin role.*

---

## 🧩 Seed Data

On first visit, the app automatically seeds:
- **1** warehouse (Main Warehouse)
- **4** locations (Shelf A, Shelf B, Input Zone, Output Zone)
- **6** products (Laptop Stand, USB-C Cable, Wireless Mouse, Monitor Arm, Keyboard, Webcam HD)
- **4** contacts (Azure Interior, TechHub Supplies, GlobalParts Inc., Deco Addict)
- **4** receipts & **4** deliveries (various statuses)
- **2** move history entries
- **1** admin user (`admin1` / `Admin@123`)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with ❤️ using **React + Vite**

⭐ Star this repo if you found it useful!

</div>
