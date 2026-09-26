import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validatePassword, validateLoginId } from '../../utils';
import './Auth.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | signup | forgot
  const { login, signup } = useAuth();
  const toast = useToast();

  /* ── Login state ── */
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  /* ── Signup state ── */
  const [sLoginId, setSLoginId] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sConfirm, setSConfirm] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    const err = login(loginId, password);
    if (err) { toast(err, 'error'); }
    else { toast('Welcome back!', 'success'); }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errs = {};
    const idErr = validateLoginId(sLoginId);
    if (idErr) errs.loginId = idErr;
    if (!sEmail || !/\S+@\S+\.\S+/.test(sEmail)) errs.email = 'Enter a valid email';
    const pwErr = validatePassword(sPassword);
    if (pwErr) errs.password = pwErr;
    if (sPassword !== sConfirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const err = signup(sLoginId, sEmail, sPassword);
    if (err) { toast(err, 'error'); }
    else { toast('Account created!', 'success'); }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    toast('Password reset link sent (simulated)', 'info');
    setMode('login');
  };

  return (
    <div className="auth-wrapper">
      {/* animated blobs */}
      <div className="auth-bg-blob blob-1" />
      <div className="auth-bg-blob blob-2" />
      <div className="auth-bg-blob blob-3" />

      {/* floating inventory icons */}
      <div className="auth-floating-icons">
        <span className="auth-float-icon">📦</span>
        <span className="auth-float-icon">🏭</span>
        <span className="auth-float-icon">📊</span>
        <span className="auth-float-icon">🚚</span>
        <span className="auth-float-icon">📋</span>
        <span className="auth-float-icon">⚙</span>
        <span className="auth-float-icon">📥</span>
        <span className="auth-float-icon">📤</span>
      </div>

      <div className="auth-container glass-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#g)" strokeWidth="3"/>
              <path d="M12 28V18l8-6 8 6v10" stroke="url(#g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 28v-6h6v6" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#6C5CE7"/><stop offset="1" stopColor="#00CEC9"/></linearGradient></defs>
            </svg>
          </div>
          <h1 className="auth-brand">StockSense</h1>
          <p className="auth-tagline">Inventory Intelligence, Simplified</p>
        </div>

        {/* ─── LOGIN ─── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <h2 className="auth-title">Welcome Back</h2>
            <div className="form-group">
              <label htmlFor="login-id">Login ID</label>
              <input id="login-id" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="Enter your login ID" required autoFocus />
            </div>
            <div className="form-group">
              <label htmlFor="login-pw">Password</label>
              <input id="login-pw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <button className="btn btn-primary btn-lg auth-submit" type="submit">Sign In</button>
            <div className="auth-links">
              <button type="button" className="auth-link" onClick={() => setMode('forgot')}>Forgot Password?</button>
              <span className="auth-divider">|</span>
              <button type="button" className="auth-link" onClick={() => setMode('signup')}>Sign Up</button>
            </div>
          </form>
        )}

        {/* ─── SIGNUP ─── */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <h2 className="auth-title">Create Account</h2>
            <div className="form-group">
              <label htmlFor="s-id">Login ID</label>
              <input id="s-id" value={sLoginId} onChange={e => setSLoginId(e.target.value)} placeholder="6-12 characters" required autoFocus />
              {errors.loginId && <span className="form-error">{errors.loginId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="s-email">Email</label>
              <input id="s-email" type="email" value={sEmail} onChange={e => setSEmail(e.target.value)} placeholder="you@email.com" required />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="s-pw">Password</label>
              <input id="s-pw" type="password" value={sPassword} onChange={e => setSPassword(e.target.value)} placeholder="Min 8 chars, mixed case + special" required />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="s-cpw">Re-enter Password</label>
              <input id="s-cpw" type="password" value={sConfirm} onChange={e => setSConfirm(e.target.value)} placeholder="Re-enter password" required />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>
            <button className="btn btn-primary btn-lg auth-submit" type="submit">Sign Up</button>
            <div className="auth-links">
              <button type="button" className="auth-link" onClick={() => setMode('login')}>← Back to Login</button>
            </div>
          </form>
        )}

        {/* ─── FORGOT ─── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="auth-form">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Enter your email to receive a reset link.</p>
            <div className="form-group">
              <label htmlFor="f-email">Email</label>
              <input id="f-email" type="email" placeholder="you@email.com" required autoFocus />
            </div>
            <button className="btn btn-primary btn-lg auth-submit" type="submit">Send Reset Link</button>
            <div className="auth-links">
              <button type="button" className="auth-link" onClick={() => setMode('login')}>← Back to Login</button>
            </div>
          </form>
        )}

        <p className="auth-hint">Demo: <strong>admin1</strong> / <strong>Admin@123</strong></p>
      </div>
    </div>
  );
}
