import { useState } from 'react';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar         from './components/Sidebar';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import Dashboard       from './pages/Dashboard';
import CreateOrderPage from './pages/CreateOrderPage';
import OrdersPage      from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentsPage    from './pages/PaymentsPage';
import ProfilePage     from './pages/ProfilePage';

function Shell() {
  const { token } = useAuth();

  const [authScreen,      setAuthScreen]      = useState('login');
  const [page,            setPage]            = useState('dashboard');
  const [selectedOrder,   setSelectedOrder]   = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ── Not logged in ──
  if (!token) {
    return authScreen === 'login'
      ? <LoginPage    switchToRegister={() => setAuthScreen('register')} />
      : <RegisterPage switchToLogin={()    => setAuthScreen('login')}    />;
  }

  // ── Logged in ──
  function renderPage() {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            setPage={setPage}
            setSelectedOrder={setSelectedOrder}
            setSelectedPayment={setSelectedPayment}
          />
        );
      case 'create-order':
        return (
          <CreateOrderPage
            setPage={setPage}
            setSelectedOrder={setSelectedOrder}
          />
        );
      case 'orders':
        return (
          <OrdersPage
            setPage={setPage}
            setSelectedOrder={setSelectedOrder}
          />
        );
      case 'order-detail':
        return (
          <OrderDetailPage
            order={selectedOrder}
            setPage={setPage}
            setSelectedPayment={setSelectedPayment}
          />
        );
      
      case 'payments':
        return (
          <PaymentsPage
            setPage={setPage}
            setSelectedPayment={setSelectedPayment}
          />
        );

      case 'profile':
        return (
          <ProfilePage 
          onBack={() => setPage('dashboard')} />
        );
      default:
        return (
          <Dashboard
            setPage={setPage}
            setSelectedOrder={setSelectedOrder}
            setSelectedPayment={setSelectedPayment}
          />
        );
    }
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
