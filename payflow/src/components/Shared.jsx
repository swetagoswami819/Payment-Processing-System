import { useApp } from '../utils/AppContext.jsx';

export function Logo({ size = 'md' }) {
  const s = size === 'sm' ? { icon: 32, text: 17 } : { icon: 38, text: 20 };
  return (
    <div className="auth-logo">
      <div className="logo-icon" style={{ width: s.icon, height: s.icon, fontSize: s.icon * 0.47 }}>P</div>
      <span className="logo-text" style={{ fontSize: s.text }}>PayFlow</span>
    </div>
  );
}

export function Badge({ status }) {
  const s = (status || '').toLowerCase();
  return <span className={`badge badge-${s}`}>{status}</span>;
}

const NAV = [
  { key: 'dashboard',   icon: '⊞', label: 'Dashboard'    },
  { key: 'createOrder', icon: '＋', label: 'Create Order'  },
  { key: 'orders',      icon: '📋', label: 'Orders'        },
  { key: 'payments',    icon: '💳', label: 'Payments'      },
];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function Sidebar() {
  const { user, page, navigate, logout } = useApp();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo size="sm" />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {NAV.map(n => (
          <button
            key={n.key}
            className={`nav-item ${page === n.key ? 'active' : ''}`}
            onClick={() => navigate(n.key)}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{initials(user?.name)}</div>
          <div>
            <div className="user-info-name">{user?.name}</div>
            <div className="user-info-email">{user?.email}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>⬖ Logout</button>
      </div>
    </aside>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export function PageHeader({ title, sub }) {
  return (
    <div className="page-header">
      <div className="page-title">{title}</div>
      {sub && <div className="page-sub">{sub}</div>}
    </div>
  );
}
