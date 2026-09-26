/* ── helpers for localStorage ── */

const PREFIX = 'stocksense_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
};

/* ── unique ID ── */
let _counter = Date.now();
export const uid = () => (++_counter).toString(36);

/* ── date helpers ── */
export const today = () => new Date().toISOString().slice(0, 10);
export const formatDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/* ── password validation ── */
export const validatePassword = (pw) => {
  if (pw.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter';
  if (!/[^a-zA-Z0-9]/.test(pw)) return 'Password must contain a special character';
  return null;
};

/* ── login-id validation ── */
export const validateLoginId = (id) => {
  if (id.length < 6 || id.length > 12) return 'Login ID must be 6–12 characters';
  return null;
};

/* ── seed data (runs once on first visit) ── */
export function seedData() {
  if (storage.get('seeded')) return;

  // Default warehouse
  const warehouses = [
    { id: uid(), name: 'Main Warehouse', code: 'WH', address: '123 Industrial Ave' },
  ];
  storage.set('warehouses', warehouses);

  // Locations
  const locations = [
    { id: uid(), warehouseId: warehouses[0].id, name: 'Shelf A', type: 'internal' },
    { id: uid(), warehouseId: warehouses[0].id, name: 'Shelf B', type: 'internal' },
    { id: uid(), warehouseId: warehouses[0].id, name: 'Input Zone', type: 'input' },
    { id: uid(), warehouseId: warehouses[0].id, name: 'Output Zone', type: 'output' },
  ];
  storage.set('locations', locations);

  // Products
  const products = [
    { id: uid(), name: 'Laptop Stand', sku: 'LS-001', category: 'Accessories', uom: 'Unit', salesPrice: 49.99, costPrice: 22.00, stock: 120, reorderLevel: 20, image: '' },
    { id: uid(), name: 'USB-C Cable', sku: 'UC-002', category: 'Cables', uom: 'Unit', salesPrice: 12.99, costPrice: 4.50, stock: 350, reorderLevel: 50, image: '' },
    { id: uid(), name: 'Wireless Mouse', sku: 'WM-003', category: 'Peripherals', uom: 'Unit', salesPrice: 29.99, costPrice: 11.00, stock: 85, reorderLevel: 15, image: '' },
    { id: uid(), name: 'Monitor Arm', sku: 'MA-004', category: 'Accessories', uom: 'Unit', salesPrice: 79.99, costPrice: 34.00, stock: 5, reorderLevel: 10, image: '' },
    { id: uid(), name: 'Keyboard (Mechanical)', sku: 'KB-005', category: 'Peripherals', uom: 'Unit', salesPrice: 89.99, costPrice: 38.00, stock: 0, reorderLevel: 10, image: '' },
    { id: uid(), name: 'Webcam HD', sku: 'WC-006', category: 'Peripherals', uom: 'Unit', salesPrice: 59.99, costPrice: 25.00, stock: 42, reorderLevel: 8, image: '' },
  ];
  storage.set('products', products);

  // Contacts
  const contacts = ['Azure Interior', 'TechHub Supplies', 'GlobalParts Inc.', 'Deco Addict'];
  storage.set('contacts', contacts);

  // Receipts (incoming)
  const receipts = [
    { id: uid(), reference: 'WH/IN/0001', contact: 'Azure Interior', scheduledDate: '2026-09-28', status: 'ready', lines: [{ productId: products[0].id, demand: 50, done: 0 }], notes: '' },
    { id: uid(), reference: 'WH/IN/0002', contact: 'TechHub Supplies', scheduledDate: '2026-09-25', status: 'waiting', lines: [{ productId: products[1].id, demand: 200, done: 0 }], notes: '' },
    { id: uid(), reference: 'WH/IN/0003', contact: 'Azure Interior', scheduledDate: '2026-09-30', status: 'draft', lines: [{ productId: products[2].id, demand: 30, done: 0 }], notes: '' },
    { id: uid(), reference: 'WH/IN/0004', contact: 'GlobalParts Inc.', scheduledDate: '2026-09-20', status: 'done', lines: [{ productId: products[3].id, demand: 15, done: 15 }], notes: '' },
  ];
  storage.set('receipts', receipts);

  // Deliveries (outgoing)
  const deliveries = [
    { id: uid(), reference: 'WH/OUT/0001', contact: 'Azure Interior', scheduledDate: '2026-09-29', status: 'ready', lines: [{ productId: products[0].id, demand: 20, done: 0 }], notes: '' },
    { id: uid(), reference: 'WH/OUT/0002', contact: 'Deco Addict', scheduledDate: '2026-09-24', status: 'waiting', lines: [{ productId: products[5].id, demand: 10, done: 0 }], notes: '' },
    { id: uid(), reference: 'WH/OUT/0003', contact: 'TechHub Supplies', scheduledDate: '2026-10-01', status: 'draft', lines: [{ productId: products[1].id, demand: 100, done: 0 }], notes: '' },
    { id: uid(), reference: 'WH/OUT/0004', contact: 'GlobalParts Inc.', scheduledDate: '2026-09-18', status: 'done', lines: [{ productId: products[2].id, demand: 5, done: 5 }], notes: '' },
  ];
  storage.set('deliveries', deliveries);

  // Move history
  const moves = [
    { id: uid(), type: 'in', reference: 'WH/IN/0004', date: '2026-09-20', contact: 'GlobalParts Inc.', from: 'Vendor', to: 'Shelf A', product: 'Monitor Arm', qty: 15, status: 'done' },
    { id: uid(), type: 'out', reference: 'WH/OUT/0004', date: '2026-09-18', contact: 'GlobalParts Inc.', from: 'Shelf B', to: 'Customer', product: 'Wireless Mouse', qty: 5, status: 'done' },
  ];
  storage.set('moves', moves);

  // Default admin user
  const users = [
    { id: uid(), loginId: 'admin1', email: 'admin@stocksense.io', password: 'Admin@123' },
  ];
  storage.set('users', users);

  storage.set('seeded', true);
  storage.set('receiptCounter', 5);
  storage.set('deliveryCounter', 5);
}
