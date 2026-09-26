import { NavLink, Outlet } from 'react-router-dom';
import './Operations.css';

export default function OperationsLayout() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Operations</h1>
      </div>
      <div className="ops-tabs">
        <NavLink to="/operations/receipts" className={({ isActive }) => `ops-tab ${isActive ? 'active' : ''}`}>
          📥 Receipts
        </NavLink>
        <NavLink to="/operations/deliveries" className={({ isActive }) => `ops-tab ${isActive ? 'active' : ''}`}>
          📤 Deliveries
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
