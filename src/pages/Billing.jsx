import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

export default function Billing() {
  const { plan, updateSubscription } = useAppContext();

  const handleUpdatePlan = (newPlan) => {
    if (window.confirm(`Are you sure you want to change your plan to ${newPlan}?`)) {
      updateSubscription(newPlan);
    }
  };

  const prices = { Free: '$0', Standard: '$9.99', Pro: '$19.99' };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 className="h1">Billing & Subscription</h1>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>Manage your subscription plan and payment methods.</p>
        </div>
      </div>

      <div className="card flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)', borderLeft: '4px solid var(--color-primary)' }}>
        <div>
          <div className="text-muted text-small font-medium uppercase tracking-wider" style={{ letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Current Plan</div>
          <div className="flex items-center gap-2">
            <h2 className="h1">{plan}</h2>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>{prices[plan]}/month. Renews automatically.</div>
        </div>
        <div className="flex gap-2">
          {plan !== 'Free' && (
            <button className="btn btn-secondary text-danger" style={{ color: 'var(--color-danger)' }} onClick={() => handleUpdatePlan('Free')}>Cancel Plan</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)' }}>
        {/* Free Plan */}
        <div className="card flex-col" style={{ position: 'relative' }}>
          <h3 className="h2" style={{ marginBottom: 'var(--spacing-2)' }}>Free</h3>
          <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>$0<span className="text-body text-muted font-normal">/mo</span></div>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)' }}>Basic features to get started with announcements.</p>
          
          <button 
            className={`btn ${plan === 'Free' ? 'btn-secondary' : 'btn-outline'}`} 
            style={{ width: '100%', marginBottom: 'var(--spacing-6)' }} 
            disabled={plan === 'Free'}
            onClick={() => handleUpdatePlan('Free')}
          >
            {plan === 'Free' ? 'Current Plan' : 'Downgrade to Free'}
          </button>
          
          <div className="flex-col gap-3">
            <div className="text-small font-medium">Templates Included:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> General Shipping Offer</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> General Flash Sale</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> General Discount Code</div>
            
            <div className="text-small font-medium" style={{ marginTop: 'var(--spacing-2)' }}>Customization:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Basic colors & text</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Top / Bottom position</div>
          </div>
        </div>

        {/* Standard Plan */}
        <div className="card flex-col" style={{ position: 'relative', border: plan === 'Standard' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} /> Most Popular
          </div>
          <h3 className="h2" style={{ marginBottom: 'var(--spacing-2)' }}>Standard</h3>
          <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>$9.99<span className="text-body text-muted font-normal">/mo</span></div>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)' }}>Advanced features for growing stores.</p>
          
          <button 
            className={`btn ${plan === 'Standard' ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%', marginBottom: 'var(--spacing-6)' }}
            disabled={plan === 'Standard'}
            onClick={() => handleUpdatePlan('Standard')}
          >
            {plan === 'Standard' ? 'Current Plan' : (plan === 'Pro' ? 'Downgrade to Standard' : 'Upgrade to Standard')}
          </button>
          
          <div className="flex-col gap-3">
            <div className="text-small font-medium">Everything in Free, plus:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> 9+ Premium Templates</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Font & Button Customization</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Banner Icons</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Scheduling</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Multiple Announcements</div>
            <div className="flex items-center gap-2 text-small text-muted"><Check size={14} className="text-success" style={{ color: 'var(--color-success)' }} /> Page Targeting</div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="card flex-col" style={{ position: 'relative', border: plan === 'Pro' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
          <h3 className="h2" style={{ marginBottom: 'var(--spacing-2)' }}>Pro</h3>
          <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>$19.99<span className="text-body text-muted font-normal">/mo</span></div>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)' }}>Ultimate tools for maximum conversion.</p>
          
          <button 
            className={`btn ${plan === 'Pro' ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%', marginBottom: 'var(--spacing-6)' }}
            disabled={plan === 'Pro'}
            onClick={() => handleUpdatePlan('Pro')}
          >
            {plan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
          
          <div className="flex-col gap-3">
            <div className="text-small font-medium">Everything in Standard, plus:</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Countdown Timers</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Banner Animations</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Rotating Banners</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Analytics Dashboard</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Geo-targeting</div>
            <div className="flex items-center gap-2 text-small text-muted"><Zap size={14} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Custom CSS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
