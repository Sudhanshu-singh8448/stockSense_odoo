import { useState, useMemo } from 'react';
import { storage, formatDate, uid, today } from '../../utils';
import { useToast } from '../../context/ToastContext';

const STATUS_ORDER = ['draft', 'waiting', 'ready', 'done'];
const STATUS_LABELS = { draft: 'Draft', waiting: 'Waiting', ready: 'Ready', done: 'Done', cancelled: 'Cancelled' };

export default function OrderList({ storageKey, referencePrefix, title, icon }) {
  const toast = useToast();
  const [view, setView] = useState('list');       // list | kanban | form
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [, setTick] = useState(0);                // force re-render

  const refresh = () => setTick(t => t + 1);

  const orders = storage.get(storageKey, []);
  const products = storage.get('products', []);
  const contacts = storage.get('contacts', []);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o =>
      o.reference.toLowerCase().includes(q) ||
      o.contact.toLowerCase().includes(q)
    );
  }, [orders, search]);

  // ── Open form for new or edit ──
  const openNew = () => {
    const counter = storage.get(storageKey + 'Counter', 1);
    const ref = `${referencePrefix}${String(counter).padStart(4, '0')}`;
    const newOrder = {
      id: uid(), reference: ref, contact: contacts[0] || '', scheduledDate: today(),
      status: 'draft', lines: [{ productId: products[0]?.id || '', demand: 1, done: 0 }], notes: '',
    };
    const updated = [...orders, newOrder];
    storage.set(storageKey, updated);
    storage.set(storageKey + 'Counter', counter + 1);
    setEditId(newOrder.id);
    setView('form');
    refresh();
  };

  const openEdit = (id) => { setEditId(id); setView('form'); };
  const backToList = () => { setEditId(null); setView('list'); };

  // ── Save handler ──
  const saveOrder = (updated) => {
    const list = storage.get(storageKey, []);
    const idx = list.findIndex(o => o.id === updated.id);
    if (idx >= 0) list[idx] = updated;
    storage.set(storageKey, list);
    refresh();
    toast('Saved', 'success');
  };

  // ── Validate (mark done) ──
  const validateOrder = (order) => {
    const updated = { ...order, status: 'done', lines: order.lines.map(l => ({ ...l, done: l.demand })) };
    saveOrder(updated);
    // Add move history
    const moves = storage.get('moves', []);
    const prods = storage.get('products', []);
    updated.lines.forEach(l => {
      const prod = prods.find(p => p.id === l.productId);
      moves.push({
        id: uid(),
        type: storageKey === 'receipts' ? 'in' : 'out',
        reference: updated.reference,
        date: today(),
        contact: updated.contact,
        from: storageKey === 'receipts' ? 'Vendor' : 'Warehouse',
        to: storageKey === 'receipts' ? 'Warehouse' : 'Customer',
        product: prod?.name || 'Unknown',
        qty: l.demand,
        status: 'done',
      });
      // Update stock
      if (prod) {
        const pidx = prods.findIndex(p => p.id === prod.id);
        if (storageKey === 'receipts') prods[pidx].stock += l.demand;
        else prods[pidx].stock = Math.max(0, prods[pidx].stock - l.demand);
      }
    });
    storage.set('moves', moves);
    storage.set('products', prods);
    toast('Order validated & stock updated!', 'success');
    refresh();
  };

  // ── Cancel ──
  const cancelOrder = (order) => {
    saveOrder({ ...order, status: 'cancelled' });
    toast('Order cancelled', 'warning');
  };

  // ── Delete ──
  const deleteOrder = (id) => {
    const list = storage.get(storageKey, []).filter(o => o.id !== id);
    storage.set(storageKey, list);
    backToList();
    refresh();
    toast('Deleted', 'info');
  };

  // ── FORM VIEW ──
  if (view === 'form' && editId) {
    const order = storage.get(storageKey, []).find(o => o.id === editId);
    if (!order) { backToList(); return null; }
    return (
      <OrderForm
        order={order}
        products={products}
        contacts={contacts}
        onSave={saveOrder}
        onValidate={validateOrder}
        onCancel={cancelOrder}
        onDelete={deleteOrder}
        onBack={backToList}
      />
    );
  }

  // ── KANBAN VIEW ──
  if (view === 'kanban') {
    const groups = {};
    STATUS_ORDER.forEach(s => groups[s] = []);
    groups['cancelled'] = [];
    filtered.forEach(o => {
      if (groups[o.status]) groups[o.status].push(o);
    });
    return (
      <div>
        <div className="ops-toolbar">
          <div className="ops-toolbar-left">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input placeholder="Search by reference or contact..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="ops-toolbar-right">
            <div className="view-toggle">
              <button onClick={() => setView('list')}>☰ List</button>
              <button className="active">▦ Kanban</button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={openNew}>+ New</button>
          </div>
        </div>
        <div className="kanban-board">
          {[...STATUS_ORDER, 'cancelled'].map(status => (
            <div className="kanban-column" key={status}>
              <div className="kanban-column-header">
                <span>{STATUS_LABELS[status]}</span>
                <span className="kanban-column-count">{groups[status].length}</span>
              </div>
              {groups[status].map(o => (
                <div className="kanban-card" key={o.id} onClick={() => openEdit(o.id)}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', marginBottom: 4 }}>{o.reference}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{o.contact}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{formatDate(o.scheduledDate)}</div>
                </div>
              ))}
              {groups[status].length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>No items</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── LIST VIEW (default) ──
  return (
    <div>
      <div className="ops-toolbar">
        <div className="ops-toolbar-left">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by reference or contact..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="ops-toolbar-right">
          <div className="view-toggle">
            <button className="active">☰ List</button>
            <button onClick={() => setView('kanban')}>▦ Kanban</button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">{icon}</span>
          <h3>No {title} found</h3>
          <p>Create a new {title.toLowerCase()} to get started.</p>
          <button className="btn btn-primary" onClick={openNew}>+ Create {title}</button>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Contact</th>
                <th>Scheduled Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} onClick={() => openEdit(o.id)}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.reference}</td>
                  <td>{o.contact}</td>
                  <td>{formatDate(o.scheduledDate)}</td>
                  <td><span className={`badge badge-${o.status}`}>{STATUS_LABELS[o.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Order Form Sub-Component ── */
function OrderForm({ order, products, contacts, onSave, onValidate, onCancel, onDelete, onBack }) {
  const [form, setForm] = useState({ ...order });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setLine = (i, k, v) => {
    const lines = [...form.lines];
    lines[i] = { ...lines[i], [k]: k === 'demand' || k === 'done' ? Number(v) : v };
    set('lines', lines);
  };
  const addLine = () => set('lines', [...form.lines, { productId: products[0]?.id || '', demand: 1, done: 0 }]);
  const removeLine = (i) => set('lines', form.lines.filter((_, j) => j !== i));

  const isDone = form.status === 'done';
  const isCancelled = form.status === 'cancelled';
  const isLocked = isDone || isCancelled;

  const handleSave = () => onSave(form);

  return (
    <div className="ops-form">
      {/* Back + header */}
      <div className="ops-form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <h2>{form.reference}</h2>
          <span className={`badge badge-${form.status}`}>{STATUS_LABELS[form.status]}</span>
        </div>
        {!isLocked && (
          <div className="ops-form-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleSave}>💾 Save</button>
            {form.status !== 'draft' && (
              <button className="btn btn-success btn-sm" onClick={() => onValidate(form)}>✓ Validate</button>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(form)}>✕ Cancel</button>
            <button className="btn btn-ghost btn-sm" onClick={() => onDelete(form.id)} style={{ color: 'var(--status-danger)' }}>🗑</button>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="ops-status-bar">
        {STATUS_ORDER.map((s, i) => (
          <span key={s}>
            {i > 0 && <span className="status-step-arrow"> → </span>}
            <span className={`status-step ${s === form.status ? 'current' : STATUS_ORDER.indexOf(form.status) > i ? 'completed' : ''}`}>
              {STATUS_LABELS[s]}
            </span>
          </span>
        ))}
      </div>

      {/* Form fields */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div className="ops-form-grid">
          <div className="form-group">
            <label>Contact</label>
            <select value={form.contact} onChange={e => set('contact', e.target.value)} disabled={isLocked}>
              {contacts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Scheduled Date</label>
            <input type="date" value={form.scheduledDate} onChange={e => set('scheduledDate', e.target.value)} disabled={isLocked} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} disabled={isLocked}>
              {[...STATUS_ORDER, 'cancelled'].map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        {/* Product lines */}
        <div className="ops-form-section">
          <h3>Product Lines</h3>
          <table className="lines-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Demand</th>
                <th>Done</th>
                {!isLocked && <th style={{width: 40}}></th>}
              </tr>
            </thead>
            <tbody>
              {form.lines.map((line, i) => (
                <tr key={i}>
                  <td>
                    <select value={line.productId} onChange={e => setLine(i, 'productId', e.target.value)} disabled={isLocked}>
                      <option value="">Select product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                    </select>
                  </td>
                  <td><input type="number" min="1" value={line.demand} onChange={e => setLine(i, 'demand', e.target.value)} disabled={isLocked} /></td>
                  <td><input type="number" min="0" value={line.done} onChange={e => setLine(i, 'done', e.target.value)} disabled={isLocked} /></td>
                  {!isLocked && <td><button className="line-remove" onClick={() => removeLine(i)}>×</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
          {!isLocked && (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={addLine}>
              + Add Line
            </button>
          )}
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginTop: 'var(--space-5)' }}>
          <label>Notes</label>
          <textarea rows="3" value={form.notes} onChange={e => set('notes', e.target.value)} disabled={isLocked} placeholder="Additional notes..." />
        </div>
      </div>
    </div>
  );
}
