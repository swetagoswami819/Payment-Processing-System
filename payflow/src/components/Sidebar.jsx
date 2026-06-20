import './Sidebar.css';
import { useAuth } from '../context/AuthContext';


const NAV_LINKS = [
  { key: 'dashboard',    icon: '⊞', label: 'Dashboard'    },
  { key: 'create-order', icon: '+', label: 'Create Order' },
  { key: 'orders',       icon: '📋', label: 'Orders'      },
  { key: 'payments',     icon: '💳', label: 'Payments'    },
  { key: 'profile',      icon: '👤', label: 'Profile'     } 
];

export default function Sidebar({ page, setPage }) {
  const { logout, username } = useAuth();
  

  return (
    <aside className="sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">💸</div>
        <span className="sidebar-name">PayFlow</span>
      </div>

      {/* NAV */}
      <nav className="sidebar-nav">
        {NAV_LINKS.map(l => (
          <button
            key={l.key}
            className={`nav-item${page === l.key ? ' active' : ''}`}
            onClick={() => setPage(l.key)}
          >
            <span className="nav-icon">{l.icon}</span>
            {l.label}
          </button>
        ))}
      </nav>

      {/*PROFILE SECTION*/}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          {username?.charAt(0)?.toUpperCase()}
        </div>

        <div className="profile-info" onClick={() => setPage('profile')}>
          <div className="profile-name">{username}</div>
          <div className="profile-role">User</div>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span>⏻</span> Logout
        </button>
      </div>
    </aside>
  );
}