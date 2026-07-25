import { Plus, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="breadcrumb text-muted font-medium">
        {/* Breadcrumb would be dynamic, hardcoded for now */}
        Overview
      </div>
      
      <div className="flex items-center gap-4">
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          <Plus size={18} />
          <span>Create Announcement</span>
        </button>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>
        
        <button className="text-muted hover:text-main" style={{ color: 'var(--color-text-muted)' }}>
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
          <span className="text-small font-medium">Merchant</span>
        </div>
      </div>
    </header>
  );
}
