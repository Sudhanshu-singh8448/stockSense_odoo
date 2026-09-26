import { useState, useMemo } from 'react';
import { storage, uid } from '../../utils';
import { useToast } from '../../context/ToastContext';
import './Products.css';

const EMPTY_PRODUCT = { name: '', sku: '', category: '', uom: 'Unit', salesPrice: 0, costPrice: 0, stock: 0, reorderLevel: 10, image: '' };
const CATEGORIES = ['Accessories', 'Cables', 'Peripherals', 'Electronics', 'Furniture', 'Other'];

export default function Products() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const products = storage.get('products', []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const openNew = () => {
    setEditProduct({ ...EMPTY_PRODUCT, id: uid() });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditProduct({ ...p });
    setShowForm(true);
  };

  const saveProduct = (product) => {
    const list = storage.get('products', []);
    const idx = list.findIndex(p => p.id === product.id);
    if (idx >= 0) list[idx] = product;
    else list.push(product);
    storage.set('products', list);
    setShowForm(false);
    setEditProduct(null);
    refresh();
    toast('Product saved', 'success');
  };

  const deleteProduct = (id) => {
    const list = storage.get('products', []).filter(p => p.id !== id);
    storage.set('products', list);
    setShowForm(false);
    setEditProduct(null);
    refresh();
    toast('Product deleted', 'info');
  };

  // ── FORM ──
  if (showForm && editProduct) {
    return (
      <div className="page-wrapper">
        <ProductForm product={editProduct} onSave={saveProduct} onDelete={deleteProduct} onBack={() => { setShowForm(false); setEditProduct(null); }} />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
      </div>

      <div className="ops-toolbar">
        <div className="ops-toolbar-left">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="ops-toolbar-right">
          <div className="view-toggle">
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>☰ List</button>
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>▦ Grid</button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Product</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No products found</h3>
          <p>Add your first product to start tracking inventory.</p>
          <button className="btn btn-primary" onClick={openNew}>+ Add Product</button>
        </div>
      ) : view === 'list' ? (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => openEdit(p)}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>${p.salesPrice?.toFixed(2)}</td>
                  <td style={{ fontWeight: 600 }}>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-cancelled' : p.stock <= p.reorderLevel ? 'badge-waiting' : 'badge-done'}`}>
                      {p.stock === 0 ? 'Out' : p.stock <= p.reorderLevel ? 'Low' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(p => (
            <div className="product-card card" key={p.id} onClick={() => openEdit(p)}>
              <div className="product-card-img">
                {p.image ? <img src={p.image} alt={p.name} /> : <span className="product-card-placeholder">📦</span>}
              </div>
              <div className="product-card-body">
                <h4>{p.name}</h4>
                <span className="product-card-sku">{p.sku}</span>
                <div className="product-card-row">
                  <span className="product-card-price">${p.salesPrice?.toFixed(2)}</span>
                  <span className={`badge ${p.stock === 0 ? 'badge-cancelled' : p.stock <= p.reorderLevel ? 'badge-waiting' : 'badge-done'}`}>
                    {p.stock} in stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Product Form ── */
function ProductForm({ product, onSave, onDelete, onBack }) {
  const [form, setForm] = useState({ ...product });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      salesPrice: Number(form.salesPrice),
      costPrice: Number(form.costPrice),
      stock: Number(form.stock),
      reorderLevel: Number(form.reorderLevel),
    });
  };

  return (
    <form onSubmit={handleSave} className="ops-form">
      <div className="ops-form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <h2>{form.name || 'New Product'}</h2>
        </div>
        <div className="ops-form-actions">
          <button type="submit" className="btn btn-primary btn-sm">💾 Save</button>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(form.id)}>🗑 Delete</button>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div className="ops-form-grid">
          <div className="form-group">
            <label>Product Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" required />
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. LS-001" required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Unit of Measure</label>
            <select value={form.uom} onChange={e => set('uom', e.target.value)}>
              {['Unit', 'Kg', 'Litre', 'Box', 'Pack'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Sales Price ($)</label>
            <input type="number" step="0.01" min="0" value={form.salesPrice} onChange={e => set('salesPrice', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Cost Price ($)</label>
            <input type="number" step="0.01" min="0" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Current Stock</label>
            <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Reorder Level</label>
            <input type="number" min="0" value={form.reorderLevel} onChange={e => set('reorderLevel', e.target.value)} />
          </div>
        </div>
      </div>
    </form>
  );
}
