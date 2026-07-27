import { Plus, Bell, User, Crown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';

export default function TopBar() {
  const navigate = useNavigate();
  const { plan, shop } = useAppContext();

  return (
    <header className="topbar">
      <div className="breadcrumb text-muted font-semibold">
        {/* Breadcrumb would be dynamic, hardcoded for now */}
        Overview
      </div>
      
      <div className="flex items-center gap-6">
        <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }} onClick={() => navigate('/create')}>
          <Plus size={16} />
          <span>New Banner</span>
        </button>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>
        
        {plan !== 'Free' && (
          <div className="badge badge-warning" style={{ gap: '4px', padding: '4px 10px' }}>
            <Crown size={14} />
            <span>{plan} Plan</span>
          </div>
        )}
        
        <button className="text-muted" style={{ cursor: 'pointer', transition: 'color 0.2s', color: 'var(--color-text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
          <Bell size={20} />
        </button>
        
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/merchant-profile')}
          style={{ cursor: 'pointer', padding: '4px', borderRadius: 'var(--radius-full)', transition: 'background-color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'} 
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <User size={18} />
          </div>
          <div className="flex flex-col" style={{ alignItems: 'flex-start' }}>
            <span className="text-small font-semibold">{shop ? shop.replace('.myshopify.com', '') : 'My Store'}</span>
            <span className="text-muted" style={{ fontSize: '11px' }}>Merchant</span>
          </div>
        </div>
      </div>
    </header>
  );
}
