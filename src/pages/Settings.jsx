import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

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
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 className="h1">Merchant Profile</h1>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>Manage your merchant profile and store settings.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <h3 className="h3" style={{ marginBottom: 'var(--spacing-4)' }}>Profile Information</h3>
        
        <div className="form-group">
          <label className="form-label">Merchant / Store Name</label>
          <input type="text" className="form-input" name="merchantName" value={formData.merchantName} onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Contact Email</label>
          <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} />
        </div>

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

        <div className="form-group">
          <label className="form-label">Time Zone</label>
          <input type="text" className="form-input" name="timeZone" value={formData.timeZone} onChange={handleChange} placeholder="e.g. America/New_York" />
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-6) 0' }}></div>
        
        <h3 className="h3" style={{ marginBottom: 'var(--spacing-4)' }}>Theme Extension</h3>
        
        <div className="flex justify-between items-center p-4" style={{ backgroundColor: 'var(--color-background)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div className="font-medium">App Block Status</div>
            <div className="text-small text-muted" style={{ marginTop: '2px' }}>Enable the Bannerly app block in your Shopify theme editor to display announcements.</div>
          </div>
          <button className="btn btn-outline text-small">Open Theme Editor</button>
        </div>
      </div>
    </div>
  );
}
