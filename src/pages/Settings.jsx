import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, Store, Globe } from 'lucide-react';
import { Page, Layout } from '@shopify/polaris';

export default function Settings() {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({
    merchantName: '',
    email: '',
    country: '',
    currency: '',
    timeZone: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        merchantName: user.merchantName || '',
        email: user.email || '',
        country: user.country || '',
        currency: user.currency || '',
        timeZone: user.timeZone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/merchant/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-merchant-id': user?.id
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page 
      title="Settings" 
      subtitle="Manage your default preferences and store configuration."
      primaryAction={{
        content: saving ? 'Saving...' : 'Save Changes',
        onAction: handleSave,
        disabled: saving,
        icon: <Save size={16} />
      }}
    >
      <Layout>
        <Layout.Section>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        
        <div>
          <h3 className="h3 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Profile Information</h3>
          <p className="text-small text-muted" style={{ marginBottom: 'var(--spacing-4)' }}>Update your contact information and store name.</p>
          
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Merchant / Store Name</label>
              <input type="text" className="form-input" name="merchantName" value={formData.merchantName} onChange={handleChange} />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Contact Email</label>
              <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }}></div>

        <div>
          <h3 className="h3 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Localization</h3>
          <p className="text-small text-muted" style={{ marginBottom: 'var(--spacing-4)' }}>Set your region and default currency.</p>
          
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Country</label>
              <input type="text" className="form-input" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. United States" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Currency</label>
              <input type="text" className="form-input" name="currency" value={formData.currency} onChange={handleChange} placeholder="e.g. USD" />
            </div>
          </div>

          <div className="form-group" style={{ width: '50%', paddingRight: '8px' }}>
            <label className="form-label">Time Zone</label>
            <input type="text" className="form-input" name="timeZone" value={formData.timeZone} onChange={handleChange} placeholder="e.g. America/New_York" />
          </div>
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }}></div>
        
        <div>
          <h3 className="h3 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Theme Extension</h3>
          <p className="text-small text-muted" style={{ marginBottom: 'var(--spacing-4)' }}>Configure Bannerly's integration with your Shopify storefront.</p>
          
          <div className="flex justify-between items-center p-4" style={{ backgroundColor: 'var(--color-primary-light)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-3">
              <div style={{ color: 'var(--color-primary)' }}><Store size={24} /></div>
              <div>
                <div className="font-semibold h3" style={{ color: 'var(--color-primary)' }}>App Block Status</div>
                <div className="text-small" style={{ marginTop: '2px', color: 'var(--color-primary-hover)' }}>Enable the Bannerly app block in your Shopify theme editor to display announcements.</div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Open Theme Editor</button>
          </div>
        </div>
        
        </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
