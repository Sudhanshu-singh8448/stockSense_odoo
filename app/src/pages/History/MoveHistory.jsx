import { useState, useMemo } from 'react';
import { storage, formatDate } from '../../utils';
import './History.css';

export default function MoveHistory() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const moves = storage.get('moves', []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return moves.filter(m => {
      if (filterType !== 'all' && m.type !== filterType) return false;
      return m.reference.toLowerCase().includes(q) ||
        m.product.toLowerCase().includes(q) ||
        m.contact.toLowerCase().includes(q);
    }).reverse();
  }, [moves, search, filterType]);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Move History</h1>
      </div>

      <div className="ops-toolbar">
        <div className="ops-toolbar-left">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by reference, product, or contact..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="history-filter">
            <button className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterType('all')}>All</button>
            <button className={`btn btn-sm ${filterType === 'in' ? 'btn-success' : 'btn-secondary'}`} onClick={() => setFilterType('in')}>↓ Incoming</button>
            <button className={`btn btn-sm ${filterType === 'out' ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setFilterType('out')}>↑ Outgoing</button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">↕</span>
          <h3>No movements found</h3>
          <p>Stock movements will appear here after validating receipts or deliveries.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Contact</th>
                <th>Product</th>
                <th>From</th>
                <th>To</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={`history-row history-${m.type}`}>
                  <td>
                    <span className={`badge ${m.type === 'in' ? 'badge-done' : 'badge-cancelled'}`}>
                      {m.type === 'in' ? '↓ IN' : '↑ OUT'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.reference}</td>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.contact}</td>
                  <td>{m.product}</td>
                  <td>{m.from}</td>
                  <td>{m.to}</td>
                  <td style={{ fontWeight: 700 }}>{m.qty}</td>
                  <td><span className="badge badge-done">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
