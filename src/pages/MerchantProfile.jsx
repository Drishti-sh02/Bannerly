import React from 'react';
import { User, Mail, Store, CreditCard, LogOut, Edit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router';

export default function MerchantProfile() {
  const { plan, shop, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 font-semibold">User Profile</h1>
          <p className="text-muted">Manage your merchant details and store settings.</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        
        <div className="flex items-center gap-4" style={{ paddingBottom: 'var(--spacing-6)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <User size={40} />
          </div>
          <div>
            <h2 className="h2 font-semibold">{shop ? shop.replace('.myshopify.com', '') : 'My Store'}</h2>
            <div className="badge badge-warning" style={{ marginTop: '8px' }}>{plan} Plan</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div style={{ color: 'var(--color-text-muted)', width: '24px' }}><Store size={20} /></div>
            <div style={{ flex: 1 }}>
              <div className="text-small text-muted">Shopify Store URL</div>
              <div className="font-medium">{shop || 'Not connected'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div style={{ color: 'var(--color-text-muted)', width: '24px' }}><Mail size={20} /></div>
            <div style={{ flex: 1 }}>
              <div className="text-small text-muted">Email Address</div>
              <div className="font-medium">merchant@{shop ? shop.replace('.myshopify.com', '') : 'store'}.com</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div style={{ color: 'var(--color-text-muted)', width: '24px' }}><CreditCard size={20} /></div>
            <div style={{ flex: 1 }}>
              <div className="text-small text-muted">Current Subscription</div>
              <div className="font-medium">{plan}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4" style={{ paddingTop: 'var(--spacing-4)', marginTop: 'var(--spacing-2)', borderTop: '1px solid var(--color-border)' }}>
          <button className="btn btn-primary" onClick={() => navigate('/app/settings')}>
            <Edit size={16} />
            Edit Profile
          </button>
          <button className="btn btn-secondary text-danger" style={{ color: 'var(--color-danger)' }} onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
