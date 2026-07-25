import React from 'react';
import { Truck, Zap, Tag, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const templates = [
  {
    category: '🚚 Shipping Offers',
    items: [
      { id: 't1', name: 'General Shipping Offer', plan: 'Free', preview: 'Free Shipping on all orders!', color: '#FEE2E2', textColor: '#EF4444' },
      { id: 't2', name: 'Free Shipping > $50', plan: 'Standard', preview: 'Free Shipping over $50', color: '#E0E7FF', textColor: '#4F46E5', locked: true },
      { id: 't3', name: 'Express Delivery', plan: 'Standard', preview: 'Express Delivery Available', color: '#FEF3C7', textColor: '#D97706', locked: true },
      { id: 't4', name: 'Same-Day Delivery', plan: 'Pro', preview: 'Order now for Same-Day Delivery', color: '#D1FAE5', textColor: '#059669', locked: true },
    ]
  },
  {
    category: '🔥 Flash Sales',
    items: [
      { id: 't5', name: 'General Flash Sale', plan: 'Free', preview: 'Flash Sale: 20% OFF!', color: '#FCE7F3', textColor: '#DB2777' },
      { id: 't6', name: 'Flash Sale (Timer)', plan: 'Pro', preview: 'Ends in 02:45:10', color: '#FFEDD5', textColor: '#EA580C', locked: true },
      { id: 't7', name: 'Mega Sale', plan: 'Standard', preview: 'Mega Sale up to 50% OFF', color: '#F3E8FF', textColor: '#9333EA', locked: true },
      { id: 't8', name: 'Weekend Sale', plan: 'Standard', preview: 'Weekend Special: Buy 1 Get 1', color: '#E0F2FE', textColor: '#0284C7', locked: true },
    ]
  },
  {
    category: '🎟 Discount Codes',
    items: [
      { id: 't9', name: 'General Discount Code', plan: 'Free', preview: 'Use Code WELCOME10', color: '#ECFCCB', textColor: '#65A30D' },
      { id: 't10', name: 'Percentage Discount', plan: 'Standard', preview: 'Get 15% OFF your cart', color: '#FFE4E6', textColor: '#E11D48', locked: true },
      { id: 't11', name: 'Flat Discount', plan: 'Standard', preview: '$10 OFF on $100+', color: '#F1F5F9', textColor: '#475569', locked: true },
      { id: 't12', name: 'First Order Offer', plan: 'Pro', preview: '10% OFF your first order', color: '#E5E7EB', textColor: '#1F2937', locked: true },
    ]
  }
];

export default function Templates() {
  const navigate = useNavigate();
  const { plan } = useAppContext();

  const isLocked = (templatePlan) => {
    if (plan === 'Pro') return false;
    if (plan === 'Standard' && templatePlan === 'Pro') return true;
    if (plan === 'Free' && templatePlan !== 'Free') return true;
    return false;
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 className="h1">Templates</h1>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>Choose a template to start building your announcement.</p>
        </div>
      </div>

      {templates.map((section, idx) => (
        <div key={idx} style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 className="h2" style={{ marginBottom: 'var(--spacing-4)' }}>{section.category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
            {section.items.map((item) => {
              const locked = isLocked(item.plan);
              return (
              <div key={item.id} className="card flex-col" style={{ display: 'flex', gap: 'var(--spacing-4)', position: 'relative' }}>
                <div style={{
                  height: '60px',
                  backgroundColor: item.color,
                  color: item.textColor,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '13px'
                }}>
                  {item.preview}
                </div>
                
                <div className="flex-col gap-2">
                  <div className="font-semibold">{item.name}</div>
                  <div className="flex justify-between items-center">
                    <span className={`badge ${item.plan === 'Free' ? 'badge-success' : item.plan === 'Pro' ? 'badge-primary' : 'badge-warning'}`}>
                      {item.plan}
                    </span>
                    {locked && (
                      <div className="flex items-center gap-1 text-muted text-small">
                        <Lock size={12} />
                        <span>Upgrade</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  className={`btn ${locked ? 'btn-secondary' : 'btn-primary'}`} 
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => locked ? navigate('/billing') : navigate('/create', { state: { template: item } })}
                >
                  {locked ? 'Unlock Template' : 'Use Template'}
                </button>
              </div>
            )})}
          </div>
        </div>
      ))}
    </div>
  );
}
