import React, { useState, useEffect } from 'react';
import { Store, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { announcements, addAnnouncement, updateAnnouncement, plan } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: 'New Announcement',
    category: 'General',
    templateName: 'Custom',
    message: 'Welcome to our store!',
    buttonText: '',
    customUrl: '',
    bgColor: '#6D5EF7',
    textColor: '#FFFFFF',
    btnColor: '#111827',
    position: 'top',
    enabled: true,
    fontFamily: 'Inter',
    roundedCorners: '4px',
    shadows: 'none',
    gradientBg: '',
    glowEffect: false,
    animation: 'none'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = announcements.find(a => a.id === id);
      if (existing) setFormData({ ...existing, enabled: existing.status === 'Active' });
    } else if (location.state?.template) {
      const t = location.state.template;
      setFormData(prev => ({
        ...prev,
        name: `${t.name} Campaign`,
        category: t.category || 'General',
        templateName: t.name,
        message: t.preview,
        bgColor: t.color,
        textColor: t.textColor
      }));
    }
  }, [id, location, announcements]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    const dataToSave = { ...formData, status: isDraft ? 'Draft' : formData.enabled ? 'Active' : 'Draft' };
    
    let res;
    if (id) {
      res = await updateAnnouncement(id, dataToSave);
    } else {
      res = await addAnnouncement(dataToSave);
    }
    
    setSaving(false);
    if (res.success) {
      navigate('/announcements');
    } else {
      alert(res.error || "Failed to save announcement.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px - 64px)' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="h2">{id ? 'Edit Announcement' : 'Create Announcement'}</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => handleSave(true)} disabled={saving}>Save Draft</button>
          <button className="btn btn-primary" onClick={() => handleSave(false)} disabled={saving}>
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-6)', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Editor */}
        <div className="card" style={{ flex: '1', overflowY: 'auto', padding: 'var(--spacing-6)' }}>
          <h3 className="h3" style={{ marginBottom: 'var(--spacing-4)' }}>Content</h3>
          
          <div className="form-group">
            <label className="form-label">Internal Name</label>
            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Announcement Message</label>
            <textarea className="form-input" name="message" value={formData.message} onChange={handleChange} rows="2" />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Button Text</label>
              <input type="text" className="form-input" name="buttonText" value={formData.buttonText} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Custom URL</label>
              <input type="text" className="form-input" name="customUrl" value={formData.customUrl} onChange={handleChange} />
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-6) 0' }}></div>
          
          <h3 className="h3" style={{ marginBottom: 'var(--spacing-4)' }}>Design & Position</h3>
          
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Background Color</label>
              <input type="color" className="form-input" name="bgColor" value={formData.bgColor} onChange={handleChange} style={{ height: '40px', padding: '4px' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Text Color</label>
              <input type="color" className="form-input" name="textColor" value={formData.textColor} onChange={handleChange} style={{ height: '40px', padding: '4px' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Button Color</label>
              <input type="color" className="form-input" name="btnColor" value={formData.btnColor} onChange={handleChange} style={{ height: '40px', padding: '4px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Position</label>
            <select className="form-input" name="position" value={formData.position} onChange={handleChange}>
              <option value="top">Top of page</option>
              <option value="bottom">Bottom of page</option>
            </select>
          </div>

          {(plan === 'Standard' || plan === 'Pro') && (
            <>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-6) 0' }}></div>
              <h3 className="h3" style={{ marginBottom: 'var(--spacing-4)' }}>Advanced Styling</h3>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Font Family</label>
                  <select className="form-input" name="fontFamily" value={formData.fontFamily} onChange={handleChange}>
                    <option value="Inter">Inter</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Rounded Corners</label>
                  <input type="text" className="form-input" name="roundedCorners" value={formData.roundedCorners} onChange={handleChange} placeholder="e.g. 4px" />
                </div>
              </div>
            </>
          )}

          {plan === 'Pro' && (
            <>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Animation</label>
                  <select className="form-input" name="animation" value={formData.animation} onChange={handleChange}>
                    <option value="none">None</option>
                    <option value="fade">Fade In</option>
                    <option value="slide">Slide Down</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>
                <div className="form-group flex items-center justify-between" style={{ flex: 1, marginTop: '24px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Glow Effect</label>
                  <label className="switch">
                    <input type="checkbox" name="glowEffect" checked={formData.glowEffect} onChange={handleChange} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between items-center" style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div className="font-medium">Enable Announcement</div>
              <div className="text-small text-muted">Show this on your store</div>
            </div>
            <label className="switch">
              <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleChange} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Right Panel - Storefront Preview */}
        <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: '#F3F4F6', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <Store size={16} className="text-muted" />
            <span className="text-small font-medium text-muted">Storefront Preview</span>
          </div>
          
          <div style={{ flex: 1, position: 'relative', overflowY: 'auto', backgroundColor: 'white', margin: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Top Announcement Bar */}
            {formData.enabled && formData.position === 'top' && (
              <div style={{ 
                backgroundColor: formData.bgColor, 
                color: formData.textColor,
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px',
                textAlign: 'center',
                fontFamily: formData.fontFamily,
                borderRadius: formData.roundedCorners !== '0px' ? `0 0 ${formData.roundedCorners} ${formData.roundedCorners}` : '0',
                boxShadow: formData.glowEffect ? `0 0 15px ${formData.bgColor}80` : 'none',
              }}>
                <span>{formData.message}</span>
                {formData.buttonText && (
                  <button style={{
                    backgroundColor: formData.btnColor,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {formData.buttonText}
                  </button>
                )}
              </div>
            )}

            {/* Store Header */}
            <header style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>My Store</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                <span>Home</span>
                <span>Catalog</span>
                <span>Contact</span>
              </div>
            </header>

            {/* Store Hero */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '60px 20px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome to our store</h2>
              <p style={{ color: '#6B7280', marginBottom: '24px' }}>Discover our amazing products</p>
              <button style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', borderRadius: '4px' }}>Shop All</button>
            </div>

            {/* Bottom Announcement Bar */}
            {formData.enabled && formData.position === 'bottom' && (
              <div style={{ 
                backgroundColor: formData.bgColor, 
                color: formData.textColor,
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px',
                textAlign: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                fontFamily: formData.fontFamily,
                borderRadius: formData.roundedCorners !== '0px' ? `${formData.roundedCorners} ${formData.roundedCorners} 0 0` : '0',
                boxShadow: formData.glowEffect ? `0 0 15px ${formData.bgColor}80` : 'none',
              }}>
                <span>{formData.message}</span>
                {formData.buttonText && (
                  <button style={{
                    backgroundColor: formData.btnColor,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {formData.buttonText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
