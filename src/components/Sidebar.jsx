import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, LayoutTemplate, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { plan, logout } = useAppContext();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Templates', path: '/templates', icon: LayoutTemplate },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">B</div>
        <div className="h3">Bannerly</div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div className="text-small font-medium">{plan} Plan</div>
          {plan === 'Free' && <div className="text-muted" style={{ fontSize: '11px', marginTop: '4px' }}>Upgrade for more features</div>}
        </div>
        <button className="btn btn-secondary text-small" style={{ width: '100%' }} onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: '8px' }} />
          Logout
        </button>
      </div>
    </aside>
  );
}
