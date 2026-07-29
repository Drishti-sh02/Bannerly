import React, { useState, useEffect } from 'react';
import { Store, Calendar, ArrowLeft, Tag, Truck, Zap, Megaphone, Clock } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Page, Layout } from '@shopify/polaris';

const HEADING_PRESETS = [
  "Flash Sale", "Mega Sale", "Weekend Sale", "Free Shipping", 
  "Express Delivery", "Same Day Delivery", "Buy One Get One", 
  "Flat Discount", "Percentage Discount", "First Order Offer", 
  "New Arrival", "Limited Time Offer"
];

const ICONS = {
  none: null,
  tag: Tag,
  truck: Truck,
  zap: Zap,
  megaphone: Megaphone,
  clock: Clock
};

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { announcements, addAnnouncement, updateAnnouncement, plan } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: 'New Announcement',
    category: 'General',
    templateName: 'Custom',
    heading: '',
    message: 'Welcome to our store!',
    buttonText: '',
    customUrl: '',
    bgColor: '#6D5EF7',
    textColor: '#FFFFFF',
    btnColor: '#111827',
    position: 'top',
    enabled: true,
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: 'normal',
    icon: 'none',
    roundedCorners: '4px',
    shadows: 'none',
    gradientBg: '',
    glowEffect: false,
    animation: 'none',
    bannerStyle: 'rectangle', // rectangle, rounded, pill, toast, ribbon
    letterSpacing: 'normal',
    textTransform: 'none',
    borderStyle: 'none',
    borderWidth: '1px',
    borderColor: '#000000',
    glassmorphism: false,
    timerStyle: 'standard', // standard, circular, flip
    timerPosition: 'right', // left, center, right
    buttonStyle: 'filled', // filled, outline, ghost
    stickers: [],
    premiumConfig: '{}'
  });

  const [activeTab, setActiveTab] = useState('content');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = announcements.find(a => a.id === id);
      if (existing) setFormData({ ...existing, enabled: existing.status === 'Active' });
    } else if (location.state?.template) {
      // Legacy handling if any lingering state exists
      const t = location.state.template;
      setFormData(prev => ({
        ...prev,
        heading: t.preview,
        bgColor: t.color,
        textColor: t.textColor
      }));
    }
  }, [id, location, announcements]);

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    if (preset) {
      setFormData(prev => ({ ...prev, heading: preset }));
    }
  };

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

  const IconComponent = ICONS[formData.icon] || null;

  return (
    <Page
      fullWidth
      backAction={{ content: 'Back', onAction: () => navigate(-1) }}
      title={id ? 'Edit Announcement' : 'Create Announcement'}
      primaryAction={{
        content: saving ? 'Saving...' : 'Publish',
        onAction: () => handleSave(false),
        disabled: saving
      }}
      secondaryActions={[
        {
          content: 'Save Draft',
          onAction: () => handleSave(true),
          disabled: saving
        }
      ]}
    >
      <Layout>
        <Layout.Section>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>

      <div style={{ display: 'flex', gap: 'var(--spacing-6)', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Editor */}
        <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
            {['Content', 'Design', 'Targeting', 'Scheduling'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer',
                  fontWeight: activeTab === tab.toLowerCase() ? 'bold' : 'normal',
                  borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--color-primary)' : '2px solid transparent',
                  color: activeTab === tab.toLowerCase() ? 'var(--color-primary)' : 'var(--color-text)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-6)' }}>
            {activeTab === 'content' && (
              <>
                <div className="form-group">
                  <label className="form-label">Internal Name</label>
                  <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} />
                </div>
                
                <div className="flex gap-4">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Heading Preset</label>
                    <select className="form-input" onChange={handlePresetChange}>
                      <option value="">Select a preset...</option>
                      {HEADING_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Custom Heading</label>
                    <input type="text" className="form-input" name="heading" value={formData.heading || ''} onChange={handleChange} placeholder="e.g. MEGA SALE" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description (Message)</label>
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

                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <select className="form-input" name="icon" value={formData.icon} onChange={handleChange}>
                    <option value="none">None</option>
                    <option value="tag">Tag</option>
                    <option value="truck">Truck</option>
                    <option value="zap">Lightning</option>
                    <option value="megaphone">Megaphone</option>
                    <option value="clock">Clock</option>
                  </select>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-6) 0' }}></div>
                
                <h3 className="h3" style={{ marginBottom: 'var(--spacing-4)' }}>Stickers & Badges</h3>
                <div className="flex gap-2 flex-wrap" style={{ marginBottom: 'var(--spacing-4)' }}>
                  {['SALE', 'NEW', 'HOT', 'FREE SHIPPING', '50% OFF'].map(sticker => (
                    <button 
                      key={sticker}
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          stickers: [...(prev.stickers || []), { id: Date.now(), text: sticker, x: 10, y: -15, color: '#FF0000' }]
                        }))
                      }}
                    >
                      + {sticker}
                    </button>
                  ))}
                </div>

                {formData.stickers && formData.stickers.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px' }}>
                    {formData.stickers.map((sticker, idx) => (
                      <div key={sticker.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                        <input type="text" className="form-input" value={sticker.text} style={{ width: '80px', padding: '4px' }} onChange={(e) => {
                          const newStickers = [...formData.stickers];
                          newStickers[idx].text = e.target.value;
                          setFormData({ ...formData, stickers: newStickers });
                        }} />
                        <label className="text-small">X:</label>
                        <input type="range" min="-50" max="100" value={sticker.x} style={{ width: '60px' }} onChange={(e) => {
                          const newStickers = [...formData.stickers];
                          newStickers[idx].x = parseInt(e.target.value);
                          setFormData({ ...formData, stickers: newStickers });
                        }} />
                        <label className="text-small">Y:</label>
                        <input type="range" min="-50" max="50" value={sticker.y} style={{ width: '60px' }} onChange={(e) => {
                          const newStickers = [...formData.stickers];
                          newStickers[idx].y = parseInt(e.target.value);
                          setFormData({ ...formData, stickers: newStickers });
                        }} />
                        <input type="color" value={sticker.color} style={{ width: '24px', height: '24px', padding: 0 }} onChange={(e) => {
                          const newStickers = [...formData.stickers];
                          newStickers[idx].color = e.target.value;
                          setFormData({ ...formData, stickers: newStickers });
                        }} />
                        <button className="text-red-500 font-bold" onClick={() => {
                          setFormData({ ...formData, stickers: formData.stickers.filter(s => s.id !== sticker.id) })
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'design' && (
              <>
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

                <div className="flex gap-4">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Position</label>
                    <select className="form-input" name="position" value={formData.position} onChange={handleChange}>
                      <option value="top">Top of page</option>
                      <option value="bottom">Bottom of page</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Banner Style (Premium)</label>
                    <select className="form-input" name="bannerStyle" value={formData.bannerStyle} onChange={handleChange} disabled={plan === 'Free'}>
                      <option value="rectangle">Full Width (Rectangle)</option>
                      <option value="pill">Floating Pill</option>
                      <option value="toast">Notification Toast</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Font Size</label>
                    <select className="form-input" name="fontSize" value={formData.fontSize} onChange={handleChange}>
                      <option value="12px">Small (12px)</option>
                      <option value="14px">Medium (14px)</option>
                      <option value="16px">Large (16px)</option>
                      <option value="18px">Extra Large (18px)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Font Weight</label>
                    <select className="form-input" name="fontWeight" value={formData.fontWeight} onChange={handleChange}>
                      <option value="normal">Normal</option>
                      <option value="500">Medium</option>
                      <option value="bold">Bold</option>
                      <option value="900">Black</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Button Style</label>
                    <select className="form-input" name="buttonStyle" value={formData.buttonStyle} onChange={handleChange}>
                      <option value="filled">Filled</option>
                      <option value="outline">Outline</option>
                      <option value="ghost">Ghost</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Letter Spacing</label>
                    <select className="form-input" name="letterSpacing" value={formData.letterSpacing} onChange={handleChange}>
                      <option value="normal">Normal</option>
                      <option value="1px">Wide (1px)</option>
                      <option value="2px">Wider (2px)</option>
                      <option value="4px">Extra Wide (4px)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Text Transform</label>
                  <select className="form-input" name="textTransform" value={formData.textTransform} onChange={handleChange}>
                    <option value="none">Normal</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>

                {(plan === 'Pro' || plan === 'Premium') && (
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
                        <label className="form-label">Gradient Background (CSS)</label>
                        <input type="text" className="form-input" name="gradientBg" value={formData.gradientBg || ''} onChange={handleChange} placeholder="e.g. linear-gradient(90deg, #fff, #000)" />
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Border Style</label>
                        <select className="form-input" name="borderStyle" value={formData.borderStyle} onChange={handleChange}>
                          <option value="none">None</option>
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Border Color</label>
                        <input type="color" className="form-input" name="borderColor" value={formData.borderColor} onChange={handleChange} style={{ height: '40px', padding: '4px' }} />
                      </div>
                    </div>

                    <div className="form-group flex items-center justify-between" style={{ marginTop: '16px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Glassmorphism (Blur Effect)</label>
                      <label className="switch">
                        <input type="checkbox" name="glassmorphism" checked={formData.glassmorphism} onChange={handleChange} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </>
                )}

                {plan === 'Premium' && (
                  <>
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Animation</label>
                        <select className="form-input" name="animation" value={formData.animation} onChange={handleChange}>
                          <option value="none">None</option>
                          <option value="fade">Fade In</option>
                          <option value="slide">Slide Down</option>
                          <option value="pulse">Pulse</option>
                          <option value="bounce">Bounce</option>
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
                    <div className="form-group">
                      <label className="form-label">Countdown Timer (Target Date & Time)</label>
                      <input 
                        type="datetime-local" 
                        className="form-input" 
                        name="countdown" 
                        value={formData.countdown ? new Date(formData.countdown).toISOString().slice(0, 16) : ''} 
                        onChange={(e) => setFormData(prev => ({ ...prev, countdown: e.target.value ? new Date(e.target.value).toISOString() : null }))} 
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Timer Style</label>
                        <select className="form-input" name="timerStyle" value={formData.timerStyle} onChange={handleChange}>
                          <option value="standard">Standard</option>
                          <option value="circular">Circular / Pill</option>
                          <option value="flip">Flip Clock</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Timer Position</label>
                        <select className="form-input" name="timerPosition" value={formData.timerPosition} onChange={handleChange}>
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'targeting' && (
              <div className="text-muted text-center" style={{ padding: '40px' }}>
                <p style={{ marginBottom: '8px' }}>Targeting features coming soon in Phase 2!</p>
                <p className="text-small">Device targeting, Page targeting, and Geo targeting will appear here.</p>
              </div>
            )}

            {activeTab === 'scheduling' && (
              <div className="text-muted text-center" style={{ padding: '40px' }}>
                <p style={{ marginBottom: '8px' }}>Smart Scheduling coming soon in Phase 2!</p>
                <p className="text-small">Start/End dates and recurring schedules will appear here.</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center" style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
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
          
          <div style={{ flex: 1, position: 'relative', overflowY: 'auto', backgroundColor: 'white', margin: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Announcement Bar */}
            {formData.enabled && formData.position === 'top' && (
              <div 
                className={`preview-animation-${formData.animation || 'none'}`}
                style={{ 
                background: formData.glassmorphism ? `${formData.bgColor}CC` : (formData.gradientBg || formData.bgColor), 
                backdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                color: formData.textColor,
                padding: '10px 16px',
                display: 'flex',
                justifyContent: formData.timerPosition === 'center' ? 'space-between' : 'center',
                alignItems: 'center',
                gap: '16px',
                fontSize: formData.fontSize || '14px',
                fontWeight: formData.fontWeight || 'normal',
                letterSpacing: formData.letterSpacing,
                textTransform: formData.textTransform,
                textAlign: 'center',
                fontFamily: formData.fontFamily,
                borderRadius: formData.bannerStyle === 'pill' ? '9999px' : (formData.bannerStyle === 'toast' ? '8px' : (formData.roundedCorners !== '0px' ? `0 0 ${formData.roundedCorners} ${formData.roundedCorners}` : '0')),
                boxShadow: formData.glowEffect ? `0 0 15px ${formData.bgColor}80` : (formData.shadows !== 'none' ? formData.shadows : 'none'),
                border: formData.borderStyle !== 'none' ? `${formData.borderWidth} ${formData.borderStyle} ${formData.borderColor}` : 'none',
                flexWrap: 'wrap',
                margin: formData.bannerStyle !== 'rectangle' ? '16px auto' : '0',
                width: formData.bannerStyle === 'toast' ? '320px' : (formData.bannerStyle === 'pill' ? 'fit-content' : '100%'),
                maxWidth: '90%',
                position: formData.bannerStyle === 'toast' ? 'absolute' : 'relative',
                top: formData.bannerStyle === 'toast' ? '16px' : 'auto',
                right: formData.bannerStyle === 'toast' ? '16px' : 'auto',
                zIndex: 50
              }}>
                {formData.stickers && formData.stickers.map(sticker => (
                  <div key={sticker.id} style={{
                    position: 'absolute',
                    top: `${sticker.y}px`,
                    left: `${sticker.x}%`,
                    backgroundColor: sticker.color,
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    transform: 'rotate(-5deg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 60,
                    whiteSpace: 'nowrap'
                  }}>
                    {sticker.text}
                  </div>
                ))}
                
                {formData.countdown && formData.timerPosition === 'left' && (
                  <div style={{ backgroundColor: formData.timerStyle === 'flip' ? '#000' : 'rgba(0,0,0,0.1)', color: formData.timerStyle === 'flip' ? '#fff' : 'inherit', padding: '2px 8px', borderRadius: formData.timerStyle === 'circular' ? '9999px' : '4px', fontWeight: 'bold' }}>
                    12:34:56
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: formData.timerPosition === 'center' ? 1 : 'unset', justifyContent: 'center' }}>
                  {IconComponent && <IconComponent size={18} />}
                  {formData.heading && <span style={{ fontWeight: 'bold' }}>{formData.heading}</span>}
                  {formData.message && <span>{formData.message}</span>}
                </div>

                {formData.countdown && formData.timerPosition === 'center' && (
                  <div style={{ backgroundColor: formData.timerStyle === 'flip' ? '#000' : 'rgba(0,0,0,0.1)', color: formData.timerStyle === 'flip' ? '#fff' : 'inherit', padding: '2px 8px', borderRadius: formData.timerStyle === 'circular' ? '9999px' : '4px', fontWeight: 'bold' }}>
                    12:34:56
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {formData.countdown && formData.timerPosition === 'right' && (
                    <div style={{ backgroundColor: formData.timerStyle === 'flip' ? '#000' : 'rgba(0,0,0,0.1)', color: formData.timerStyle === 'flip' ? '#fff' : 'inherit', padding: '2px 8px', borderRadius: formData.timerStyle === 'circular' ? '9999px' : '4px', fontWeight: 'bold' }}>
                      12:34:56
                    </div>
                  )}
                  {formData.buttonText && (
                    <button style={{
                      backgroundColor: formData.buttonStyle === 'outline' || formData.buttonStyle === 'ghost' ? 'transparent' : formData.btnColor,
                      color: formData.buttonStyle === 'outline' || formData.buttonStyle === 'ghost' ? formData.btnColor : 'white',
                      border: formData.buttonStyle === 'outline' ? `1px solid ${formData.btnColor}` : 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {formData.buttonText}
                    </button>
                  )}
                </div>
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
              <div 
                className={`preview-animation-${formData.animation || 'none'}`}
                style={{ 
                background: formData.glassmorphism ? `${formData.bgColor}CC` : (formData.gradientBg || formData.bgColor), 
                backdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                color: formData.textColor,
                padding: '10px 16px',
                display: 'flex',
                justifyContent: formData.timerPosition === 'center' ? 'space-between' : 'center',
                alignItems: 'center',
                gap: '16px',
                fontSize: formData.fontSize || '14px',
                fontWeight: formData.fontWeight || 'normal',
                letterSpacing: formData.letterSpacing,
                textTransform: formData.textTransform,
                textAlign: 'center',
                fontFamily: formData.fontFamily,
                borderRadius: formData.bannerStyle === 'pill' ? '9999px' : (formData.bannerStyle === 'toast' ? '8px' : (formData.roundedCorners !== '0px' ? `${formData.roundedCorners} ${formData.roundedCorners} 0 0` : '0')),
                boxShadow: formData.glowEffect ? `0 0 15px ${formData.bgColor}80` : (formData.shadows !== 'none' ? formData.shadows : 'none'),
                border: formData.borderStyle !== 'none' ? `${formData.borderWidth} ${formData.borderStyle} ${formData.borderColor}` : 'none',
                flexWrap: 'wrap',
                position: 'absolute',
                bottom: formData.bannerStyle !== 'rectangle' ? '16px' : '0',
                right: formData.bannerStyle === 'toast' ? '16px' : 'auto',
                left: formData.bannerStyle === 'pill' ? '50%' : (formData.bannerStyle === 'toast' ? 'auto' : '0'),
                transform: formData.bannerStyle === 'pill' ? 'translateX(-50%)' : 'none',
                width: formData.bannerStyle === 'toast' ? '320px' : (formData.bannerStyle === 'pill' ? 'fit-content' : '100%'),
                maxWidth: '90%',
                zIndex: 50
              }}>
                {formData.stickers && formData.stickers.map(sticker => (
                  <div key={sticker.id} style={{
                    position: 'absolute',
                    top: `${sticker.y}px`,
                    left: `${sticker.x}%`,
                    backgroundColor: sticker.color,
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    transform: 'rotate(-5deg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 60,
                    whiteSpace: 'nowrap'
                  }}>
                    {sticker.text}
                  </div>
                ))}
                
                {formData.countdown && formData.timerPosition === 'left' && (
                  <div style={{ backgroundColor: formData.timerStyle === 'flip' ? '#000' : 'rgba(0,0,0,0.1)', color: formData.timerStyle === 'flip' ? '#fff' : 'inherit', padding: '2px 8px', borderRadius: formData.timerStyle === 'circular' ? '9999px' : '4px', fontWeight: 'bold' }}>
                    12:34:56
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: formData.timerPosition === 'center' ? 1 : 'unset', justifyContent: 'center' }}>
                  {IconComponent && <IconComponent size={18} />}
                  {formData.heading && <span style={{ fontWeight: 'bold' }}>{formData.heading}</span>}
                  {formData.message && <span>{formData.message}</span>}
                </div>

                {formData.countdown && formData.timerPosition === 'center' && (
                  <div style={{ backgroundColor: formData.timerStyle === 'flip' ? '#000' : 'rgba(0,0,0,0.1)', color: formData.timerStyle === 'flip' ? '#fff' : 'inherit', padding: '2px 8px', borderRadius: formData.timerStyle === 'circular' ? '9999px' : '4px', fontWeight: 'bold' }}>
                    12:34:56
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {formData.countdown && formData.timerPosition === 'right' && (
                    <div style={{ backgroundColor: formData.timerStyle === 'flip' ? '#000' : 'rgba(0,0,0,0.1)', color: formData.timerStyle === 'flip' ? '#fff' : 'inherit', padding: '2px 8px', borderRadius: formData.timerStyle === 'circular' ? '9999px' : '4px', fontWeight: 'bold' }}>
                      12:34:56
                    </div>
                  )}
                  {formData.buttonText && (
                    <button style={{
                      backgroundColor: formData.buttonStyle === 'outline' || formData.buttonStyle === 'ghost' ? 'transparent' : formData.btnColor,
                      color: formData.buttonStyle === 'outline' || formData.buttonStyle === 'ghost' ? formData.btnColor : 'white',
                      border: formData.buttonStyle === 'outline' ? `1px solid ${formData.btnColor}` : 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {formData.buttonText}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
