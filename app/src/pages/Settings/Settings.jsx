import { useState } from 'react';
import { storage, uid } from '../../utils';
import { useToast } from '../../context/ToastContext';
import './Settings.css';

export default function Settings() {
  const toast = useToast();
  const [tab, setTab] = useState('warehouses');
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const warehouses = storage.get('warehouses', []);
  const locations = storage.get('locations', []);

  /* ── Warehouse CRUD ── */
  const [whForm, setWhForm] = useState({ name: '', code: '', address: '' });
  const [editWh, setEditWh] = useState(null);

  const saveWarehouse = (e) => {
    e.preventDefault();
    const list = storage.get('warehouses', []);
    if (editWh) {
      const idx = list.findIndex(w => w.id === editWh);
      list[idx] = { ...list[idx], ...whForm };
    } else {
      list.push({ id: uid(), ...whForm });
    }
    storage.set('warehouses', list);
    setWhForm({ name: '', code: '', address: '' });
    setEditWh(null);
    refresh();
    toast('Warehouse saved', 'success');
  };

  const editWarehouse = (w) => {
    setWhForm({ name: w.name, code: w.code, address: w.address });
    setEditWh(w.id);
  };

  const deleteWarehouse = (id) => {
    storage.set('warehouses', storage.get('warehouses', []).filter(w => w.id !== id));
    storage.set('locations', storage.get('locations', []).filter(l => l.warehouseId !== id));
    refresh();
    toast('Warehouse deleted', 'info');
  };

  /* ── Location CRUD ── */
  const [locForm, setLocForm] = useState({ warehouseId: warehouses[0]?.id || '', name: '', type: 'internal' });
  const [editLoc, setEditLoc] = useState(null);

  const saveLocation = (e) => {
    e.preventDefault();
    const list = storage.get('locations', []);
    if (editLoc) {
      const idx = list.findIndex(l => l.id === editLoc);
      list[idx] = { ...list[idx], ...locForm };
    } else {
      list.push({ id: uid(), ...locForm });
    }
    storage.set('locations', list);
    setLocForm({ warehouseId: warehouses[0]?.id || '', name: '', type: 'internal' });
    setEditLoc(null);
    refresh();
    toast('Location saved', 'success');
  };

  const editLocation = (l) => {
    setLocForm({ warehouseId: l.warehouseId, name: l.name, type: l.type });
    setEditLoc(l.id);
  };

  const deleteLocation = (id) => {
    storage.set('locations', storage.get('locations', []).filter(l => l.id !== id));
    refresh();
    toast('Location deleted', 'info');
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-tabs">
        <button className={`settings-tab ${tab === 'warehouses' ? 'active' : ''}`} onClick={() => setTab('warehouses')}>
          🏭 Warehouses
        </button>
        <button className={`settings-tab ${tab === 'locations' ? 'active' : ''}`} onClick={() => setTab('locations')}>
          📍 Locations
        </button>
      </div>

      {/* ── Warehouses ── */}
      {tab === 'warehouses' && (
        <div className="settings-content">
          <form className="settings-form card" onSubmit={saveWarehouse}>
            <h3>{editWh ? 'Edit Warehouse' : 'Add Warehouse'}</h3>
            <div className="ops-form-grid">
              <div className="form-group">
                <label>Name</label>
                <input value={whForm.name} onChange={e => setWhForm({ ...whForm, name: e.target.value })} placeholder="Warehouse name" required />
              </div>
              <div className="form-group">
                <label>Short Code</label>
                <input value={whForm.code} onChange={e => setWhForm({ ...whForm, code: e.target.value })} placeholder="e.g. WH" required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={whForm.address} onChange={e => setWhForm({ ...whForm, address: e.target.value })} placeholder="Address" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                {editWh ? 'Update' : '+ Add'}
              </button>
              {editWh && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditWh(null); setWhForm({ name: '', code: '', address: '' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="card" style={{ overflow: 'auto', marginTop: 'var(--space-5)' }}>
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Code</th><th>Address</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {warehouses.map(w => (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</td>
                    <td><span className="badge badge-ready">{w.code}</span></td>
                    <td>{w.address || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => editWarehouse(w)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--status-danger)' }} onClick={() => deleteWarehouse(w.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {warehouses.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>No warehouses yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Locations ── */}
      {tab === 'locations' && (
        <div className="settings-content">
          <form className="settings-form card" onSubmit={saveLocation}>
            <h3>{editLoc ? 'Edit Location' : 'Add Location'}</h3>
            <div className="ops-form-grid">
              <div className="form-group">
                <label>Warehouse</label>
                <select value={locForm.warehouseId} onChange={e => setLocForm({ ...locForm, warehouseId: e.target.value })} required>
                  <option value="">Select warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location Name</label>
                <input value={locForm.name} onChange={e => setLocForm({ ...locForm, name: e.target.value })} placeholder="e.g. Shelf A" required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={locForm.type} onChange={e => setLocForm({ ...locForm, type: e.target.value })}>
                  <option value="internal">Internal</option>
                  <option value="input">Input Zone</option>
                  <option value="output">Output Zone</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary btn-sm">{editLoc ? 'Update' : '+ Add'}</button>
              {editLoc && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditLoc(null); setLocForm({ warehouseId: warehouses[0]?.id || '', name: '', type: 'internal' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="card" style={{ overflow: 'auto', marginTop: 'var(--space-5)' }}>
            <table className="data-table">
              <thead>
                <tr><th>Warehouse</th><th>Location</th><th>Type</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {locations.map(l => {
                  const wh = warehouses.find(w => w.id === l.warehouseId);
                  return (
                    <tr key={l.id}>
                      <td>{wh?.name || '—'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</td>
                      <td><span className={`badge ${l.type === 'input' ? 'badge-done' : l.type === 'output' ? 'badge-cancelled' : 'badge-ready'}`}>{l.type}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => editLocation(l)}>✏️</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--status-danger)' }} onClick={() => deleteLocation(l.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {locations.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>No locations yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
