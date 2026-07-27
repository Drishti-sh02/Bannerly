import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';

const templates = [
  {
    category: 'Shipping Offers',
    items: [
      { id: 't1', name: 'General Shipping Offer', plan: 'Free', preview: 'Free Shipping on all orders!', color: '#FEE2E2', textColor: '#EF4444' },
      { id: 't2', name: 'Free Shipping > $50', plan: 'Pro', preview: 'Free Shipping over $50', color: '#E0E7FF', textColor: '#4F46E5', gradientBg: 'linear-gradient(90deg, #E0E7FF 0%, #C7D2FE 100%)', shadows: '0 4px 6px -1px rgba(79, 70, 229, 0.1)' },
      { id: 't3', name: 'Express Delivery', plan: 'Pro', preview: 'Express Delivery Available', color: '#FEF3C7', textColor: '#D97706', gradientBg: 'linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)', roundedCorners: '12px' },
      { id: 't4', name: 'Same-Day Delivery', plan: 'Premium', preview: 'Order now for Same-Day Delivery', color: '#D1FAE5', textColor: '#059669', gradientBg: 'linear-gradient(90deg, #D1FAE5 0%, #A7F3D0 100%)', glowEffect: true, animation: 'pulse' },
    ]
  },
  {
    category: 'Flash Sales',
    items: [
      { id: 't5', name: 'General Flash Sale', plan: 'Free', preview: 'Flash Sale: 20% OFF!', color: '#FCE7F3', textColor: '#DB2777' },
      { id: 't6', name: 'Flash Sale (Timer)', plan: 'Premium', preview: 'Ends in 02:45:10', color: '#FFEDD5', textColor: '#EA580C', countdown: true, animation: 'bounce', glowEffect: true, roundedCorners: '8px' },
      { id: 't7', name: 'Mega Sale', plan: 'Pro', preview: 'Mega Sale up to 50% OFF', color: '#F3E8FF', textColor: '#9333EA', gradientBg: 'linear-gradient(90deg, #F3E8FF 0%, #E9D5FF 100%)', shadows: '0 10px 15px -3px rgba(147, 51, 234, 0.1)' },
      { id: 't8', name: 'Weekend Sale', plan: 'Pro', preview: 'Weekend Special: Buy 1 Get 1', color: '#E0F2FE', textColor: '#0284C7', gradientBg: 'linear-gradient(90deg, #E0F2FE 0%, #BAE6FD 100%)', fontFamily: 'serif' },
    ]
  },
  {
    category: 'Discount Offers',
    items: [
      { id: 't9', name: 'General Discount Code', plan: 'Free', preview: 'Use Code WELCOME10', color: '#ECFCCB', textColor: '#65A30D' },
      { id: 't10', name: 'Percentage Discount', plan: 'Pro', preview: 'Get 15% OFF your cart', color: '#FFE4E6', textColor: '#E11D48', gradientBg: 'linear-gradient(90deg, #FFE4E6 0%, #FECDD3 100%)', fontFamily: 'monospace' },
      { id: 't11', name: 'Flat Discount', plan: 'Pro', preview: '$10 OFF on $100+', color: '#F1F5F9', textColor: '#475569', gradientBg: 'linear-gradient(90deg, #F8FAFC 0%, #E2E8F0 100%)', shadows: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
      { id: 't12', name: 'First Order Offer', plan: 'Premium', preview: '10% OFF your first order', color: '#E5E7EB', textColor: '#1F2937', gradientBg: 'linear-gradient(90deg, #E5E7EB 0%, #D1D5DB 100%)', animation: 'slide', glowEffect: true },
    ]
  }
];

export default function Templates() {
  const navigate = useNavigate();
  const { plan } = useAppContext();

  const isLocked = (templatePlan) => {
    if (plan === 'Premium') return false;
    if (plan === 'Pro' && templatePlan === 'Premium') return true;
    if (plan === 'Free' && templatePlan !== 'Free') return true;
    return false;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)' }}>
        <div>
          <h1 className="h1 font-semibold">Templates</h1>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>Choose a template to start building your announcement.</p>
        </div>
      </div>

      {templates.map((section, idx) => (
        <div key={idx} style={{ marginBottom: 'var(--spacing-10)' }}>
          <h2 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-text-main)' }}>{section.category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
            {section.items.map((item) => {
              const locked = isLocked(item.plan);
              return (
              <div 
                key={item.id} 
                className="card flex-col" 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-4)', 
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  height: '80px',
                  backgroundColor: item.color,
                  color: item.textColor,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: locked ? 0.6 : 1
                }}>
                  {item.preview}
                </div>
                
                <div className="flex-col gap-2" style={{ flex: 1 }}>
                  <div className="font-semibold h3">{item.name}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`badge ${item.plan === 'Free' ? 'badge-success' : item.plan === 'Pro' ? 'badge-primary' : 'badge-warning'}`}>
                      {item.plan === 'Premium' && <Crown size={12} style={{ marginRight: '4px' }} />}
                      {item.plan}
                    </span>
                  </div>
                </div>
                
                <button 
                  className={`btn ${locked ? 'btn-secondary' : 'btn-primary'}`} 
                  style={{ width: '100%', marginTop: 'var(--spacing-2)' }}
                  onClick={() => locked ? navigate('/billing') : navigate('/create', { state: { template: item } })}
                >
                  {locked ? (
                    <div className="flex items-center justify-center gap-2 text-warning">
                      <Lock size={16} /> Unlock Template
                    </div>
                  ) : 'Use Template'}
                </button>
              </div>
            )})}
          </div>
        </div>
      ))}
    </div>
  );
}
