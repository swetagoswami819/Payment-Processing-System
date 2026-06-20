import { useState, useEffect } from 'react';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import Badge from '../components/Badge';
import ProfilePage from "./ProfilePage";

export default function Dashboard({ setPage, setSelectedOrder, page }) {
  const { token, username } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/orders/ordersByUserId', {}, token)
      .then(data => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const paid = orders.filter(o => o.orderStatus === 'COMPLETED').length;
  const pending = orders.filter(o => o.orderStatus === 'PENDING').length;
  const recent = orders.slice(0, 5);

  // ✅ PROFILE PAGE RENDER
  if (page === "profile") {
    return <ProfilePage onBack={() => setPage("dashboard")} />;
  }

  return (
    <div className="dashboard">

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {username} 👋</h2>
          <p>Here's a summary of your payment activity</p>
        </div>

        <button
          className="btn"
          style={{
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            border: '1.5px solid rgba(255,255,255,0.35)'
          }}
          onClick={() => setPage('create-order')}
        >
          + Create Order
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Paid Orders</div>
          <div className="stat-value" style={{ color: '#10B981' }}>{paid}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: '#F59E0B' }}>{pending}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dash-grid">
        <div className="card">
          <div className="card-title">📋 Recent Orders</div>

          {loading ? (
            <div className="empty">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="empty">No orders yet</div>
          ) : (
            recent.map(o => (
              <div className="order-row" key={o.orderNumber}>
                <div>
                  <div className="order-num">{o.orderNumber}</div>
                  <div className="order-amt">₹{o.amount}</div>
                </div>

                <div className="order-row-right">
                  <Badge status={o.orderStatus} />
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSelectedOrder(o);
                      setPage('order-detail');
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-title">⚡ Quick Actions</div>

          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => setPage('create-order')}>
              + Create New Order
            </button>

            <button className="btn btn-outline" onClick={() => setPage('orders')}>
              View All Orders
            </button>

            <button className="btn btn-outline" onClick={() => setPage('payments')}>
              Payment History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}