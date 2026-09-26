import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { seedData } from './utils';

import AppLayout from './components/Layout/AppLayout';
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './pages/Dashboard/Dashboard';
import OperationsLayout from './pages/Operations/OperationsLayout';
import Receipts from './pages/Operations/Receipts';
import Deliveries from './pages/Operations/Deliveries';
import Products from './pages/Products/Products';
import MoveHistory from './pages/History/MoveHistory';
import Settings from './pages/Settings/Settings';

import './App.css';

// Seed data on first load
seedData();

function ProtectedRoutes() {
  const { user } = useAuth();
  if (!user) return <AuthPage />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/operations" element={<OperationsLayout />}>
          <Route index element={<Navigate to="receipts" replace />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="deliveries" element={<Deliveries />} />
        </Route>
        <Route path="/products" element={<Products />} />
        <Route path="/history" element={<MoveHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ProtectedRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
