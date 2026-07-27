import { NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, Megaphone, LayoutTemplate, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { plan, logout } = useAppContext();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Banner', path: '/create', icon: LayoutTemplate },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">B</div>
        <div className="h3 font-semibold" style={{ color: 'var(--color-primary)' }}>Bannerly</div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--color-background)', border: 'none' }}>
          <div className="text-small font-semibold" style={{ color: 'var(--color-primary)' }}>{plan} Plan</div>
          {plan === 'Free' && <div className="text-muted" style={{ fontSize: '11px', marginTop: '4px' }}>Upgrade to unlock features</div>}
        </div>
        
        <button className="btn btn-secondary text-small" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: '8px' }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
