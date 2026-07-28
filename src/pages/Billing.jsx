import React, { useState } from 'react';
import { Check, Star, Zap, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Page, Layout } from '@shopify/polaris';

export default function Billing() {
  const { plan, updateSubscription } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState('');

  const handleUpdatePlan = (newPlan) => {
    if (newPlan === 'Free') {
      if (window.confirm(`Are you sure you want to downgrade to Free?`)) {
        updateSubscription(newPlan);
      }
    } else {
      updateSubscription(newPlan);
      setUpgradedPlan(newPlan);
      setShowModal(true);
    }
  };

  const prices = { Free: '$0', Pro: '$9.99', Premium: '$19.99' };

  return (
    <Page title="Billing & Subscription" subtitle="Manage your subscription plan and unlock premium features.">
      
      {/* Modern Success Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-4)' }}>
              <Check size={32} />
            </div>
            <h2 className="h1 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Congratulations!</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--spacing-6)' }}>
              Your subscription has been upgraded successfully.<br/>
              Welcome to the <strong>{upgradedPlan} Plan</strong>.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowModal(false)}>Back to Dashboard</button>
          </div>
        </div>
      )}

      <Layout>
        <Layout.Section>

      <div className="card flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)', borderLeft: '4px solid var(--color-primary)' }}>
        <div>
          <div className="text-muted text-small font-semibold uppercase tracking-wider" style={{ letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Current Plan</div>
          <div className="flex items-center gap-3">
            <h2 className="h1">{plan}</h2>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>{prices[plan]}/month. Renews automatically.</div>
        </div>
        <div className="flex gap-2">
          {plan !== 'Free' && (
            <button className="btn btn-secondary" style={{ color: 'var(--color-danger)' }} onClick={() => handleUpdatePlan('Free')}>Cancel Plan</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)' }}>
        
        {/* Free Plan */}
        <div className="card flex-col" style={{ position: 'relative', transition: 'transform 0.2s', transform: plan === 'Free' ? 'translateY(-4px)' : 'none', border: plan === 'Free' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
          <h3 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Free</h3>
          <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>$0<span className="text-body text-muted font-normal">/mo</span></div>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)' }}>Basic features to get started with announcements.</p>
          
          <button 
            className={`btn ${plan === 'Free' ? 'btn-secondary' : 'btn-outline'}`} 
            style={{ width: '100%', marginBottom: 'var(--spacing-6)' }} 
            disabled={plan === 'Free'}
            onClick={() => handleUpdatePlan('Free')}
          >
            {plan === 'Free' ? 'Current Plan' : 'Downgrade'}
          </button>
          
          <div className="flex-col gap-3">
            <div className="text-small font-semibold">Features Included:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> 3 Templates</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Basic Customization</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Top / Bottom Position</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Live Preview</div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="card flex-col" style={{ position: 'relative', transition: 'transform 0.2s', transform: plan === 'Pro' ? 'translateY(-4px)' : 'none', border: plan === 'Pro' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} /> Most Popular
          </div>
          <h3 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Pro</h3>
          <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>$9.99<span className="text-body text-muted font-normal">/mo</span></div>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)' }}>Advanced features for growing stores.</p>
          
          <button 
            className={`btn ${plan === 'Pro' ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%', marginBottom: 'var(--spacing-6)' }}
            disabled={plan === 'Pro'}
            onClick={() => handleUpdatePlan('Pro')}
          >
            {plan === 'Pro' ? 'Current Plan' : (plan === 'Premium' ? 'Downgrade' : 'Approve Upgrade')}
          </button>
          
          <div className="flex-col gap-3">
            <div className="text-small font-semibold">Everything in Free, plus:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> 9 Templates</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Font Customization</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Banner Icons</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Multiple Announcements</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Page Targeting</div>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="card flex-col" style={{ position: 'relative', transition: 'transform 0.2s', transform: plan === 'Premium' ? 'translateY(-4px)' : 'none', border: plan === 'Premium' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
          <h3 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Premium</h3>
          <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>$19.99<span className="text-body text-muted font-normal">/mo</span></div>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)' }}>Ultimate tools for maximum conversion.</p>
          
          <button 
            className={`btn ${plan === 'Premium' ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%', marginBottom: 'var(--spacing-6)' }}
            disabled={plan === 'Premium'}
            onClick={() => handleUpdatePlan('Premium')}
          >
            {plan === 'Premium' ? 'Current Plan' : 'Approve Upgrade'}
          </button>
          
          <div className="flex-col gap-3">
            <div className="text-small font-semibold">Everything in Pro, plus:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Unlimited Templates</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Countdown Timers</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Banner Animations</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Analytics Dashboard</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> A/B Testing</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Geo-targeting</div>
          </div>
        </div>

      </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
