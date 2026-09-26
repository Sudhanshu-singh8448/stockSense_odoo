import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import './Layout.css';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/operations', label: 'Operations', icon: '⟳' },
  { to: '/products', label: 'Products', icon: '☰' },
  { to: '/history', label: 'Move History', icon: '↕' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav className="app-nav">
        <div className="nav-inner">
          {/* Brand */}
          <NavLink to="/" className="nav-brand">
            <div className="nav-brand-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect x="1" y="1" width="30" height="30" rx="7" stroke="url(#ng)" strokeWidth="2.5"/>
                <path d="M9 24V16l7-5 7 5v8" stroke="url(#ng)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 24v-5h6v5" stroke="url(#ng)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="ng" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#6C5CE7"/><stop offset="1" stopColor="#00CEC9"/></linearGradient></defs>
              </svg>
            </div>
            <span className="nav-brand-text">StockSense</span>
          </NavLink>

          {/* Links */}
          <div className="nav-links">
            {navItems.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-link-icon">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </div>

          {/* Profile */}
          <div className="nav-profile" ref={dropRef}>
            <button className="nav-avatar" onClick={() => setShowProfile(!showProfile)}>
              {user?.loginId?.[0]?.toUpperCase() || 'A'}
            </button>
            {showProfile && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-header">
                  <strong>{user?.loginId}</strong>
                  <span>{user?.email}</span>
                </div>
                <div className="nav-dropdown-divider" />
                <button className="nav-dropdown-item" onClick={handleLogout}>
                  <span>↪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
