import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, formatDate, today } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const products = storage.get('products', []);
    const receipts = storage.get('receipts', []);
    const deliveries = storage.get('deliveries', []);
    const moves = storage.get('moves', []);
    const t = today();

    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    const pendingReceipts = receipts.filter(r => r.status !== 'done' && r.status !== 'cancelled');
    const receiptLate = pendingReceipts.filter(r => r.scheduledDate < t).length;
    const receiptWaiting = pendingReceipts.filter(r => r.status === 'waiting').length;
    const receiptReady = pendingReceipts.filter(r => r.status === 'ready').length;

    const pendingDeliveries = deliveries.filter(d => d.status !== 'done' && d.status !== 'cancelled');
    const deliveryLate = pendingDeliveries.filter(d => d.scheduledDate < t).length;
    const deliveryWaiting = pendingDeliveries.filter(d => d.status === 'waiting').length;
    const deliveryReady = pendingDeliveries.filter(d => d.status === 'ready').length;

    const recentMoves = moves.slice(-5).reverse();

    return {
      totalProducts, lowStock, outOfStock,
      pendingReceipts: pendingReceipts.length, receiptLate, receiptWaiting, receiptReady,
      pendingDeliveries: pendingDeliveries.length, deliveryLate, deliveryWaiting, deliveryReady,
      totalMoves: moves.length, recentMoves,
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="dash-greeting">
        <h1 className="page-title">Welcome back, {user?.loginId} 👋</h1>
        <p className="dash-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {/* ── KPI Row ── */}
      <div className="dash-kpi-grid">
        <div className="kpi-card" onClick={() => navigate('/products')}>
          <div className="kpi-icon kpi-purple">📦</div>
          <div className="kpi-info">
            <span className="kpi-value">{stats.totalProducts}</span>
            <span className="kpi-label">Total Products</span>
          </div>
        </div>
        <div className="kpi-card" onClick={() => navigate('/products')}>
          <div className="kpi-icon kpi-orange">⚠</div>
          <div className="kpi-info">
            <span className="kpi-value">{stats.lowStock}</span>
            <span className="kpi-label">Low Stock</span>
          </div>
        </div>
        <div className="kpi-card" onClick={() => navigate('/products')}>
          <div className="kpi-icon kpi-red">✕</div>
          <div className="kpi-info">
            <span className="kpi-value">{stats.outOfStock}</span>
            <span className="kpi-label">Out of Stock</span>
          </div>
        </div>
        <div className="kpi-card" onClick={() => navigate('/history')}>
          <div className="kpi-icon kpi-blue">↕</div>
          <div className="kpi-info">
            <span className="kpi-value">{stats.totalMoves}</span>
            <span className="kpi-label">Total Movements</span>
          </div>
        </div>
      </div>

      {/* ── Operations Row ── */}
      <div className="dash-ops-grid">
        {/* Receipt Card */}
        <div className="ops-card card">
          <div className="ops-card-header">
            <div className="ops-card-title">
              <span className="ops-icon receipt-icon">📥</span>
              <h3>Receipts</h3>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/operations/receipts')}>
              View All →
            </button>
          </div>
          <div className="ops-card-body">
            <div className="ops-stat-row">
              <span className="ops-stat-big">{stats.pendingReceipts}</span>
              <span className="ops-stat-label">To Receive</span>
            </div>
            <div className="ops-breakdown">
              <div className="ops-breakdown-item">
                <span className="ops-dot dot-red" />
                <span>{stats.receiptLate} Late</span>
              </div>
              <div className="ops-breakdown-item">
                <span className="ops-dot dot-yellow" />
                <span>{stats.receiptWaiting} Waiting</span>
              </div>
              <div className="ops-breakdown-item">
                <span className="ops-dot dot-blue" />
                <span>{stats.receiptReady} Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Card */}
        <div className="ops-card card">
          <div className="ops-card-header">
            <div className="ops-card-title">
              <span className="ops-icon delivery-icon">📤</span>
              <h3>Deliveries</h3>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/operations/deliveries')}>
              View All →
            </button>
          </div>
          <div className="ops-card-body">
            <div className="ops-stat-row">
              <span className="ops-stat-big">{stats.pendingDeliveries}</span>
              <span className="ops-stat-label">To Deliver</span>
            </div>
            <div className="ops-breakdown">
              <div className="ops-breakdown-item">
                <span className="ops-dot dot-red" />
                <span>{stats.deliveryLate} Late</span>
              </div>
              <div className="ops-breakdown-item">
                <span className="ops-dot dot-yellow" />
                <span>{stats.deliveryWaiting} Waiting</span>
              </div>
              <div className="ops-breakdown-item">
                <span className="ops-dot dot-blue" />
                <span>{stats.deliveryReady} Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Moves ── */}
      <div className="dash-recent card">
        <div className="dash-recent-header">
          <h3>Recent Movements</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>View All →</button>
        </div>
        {stats.recentMoves.length === 0 ? (
          <p className="dash-no-data">No movements yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Date</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentMoves.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.reference}</td>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.product}</td>
                  <td>{m.qty}</td>
                  <td>
                    <span className={`badge ${m.type === 'in' ? 'badge-done' : 'badge-cancelled'}`}>
                      {m.type === 'in' ? '↓ IN' : '↑ OUT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
