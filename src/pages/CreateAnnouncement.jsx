import React, { useState, useEffect } from 'react';
import { Store, Tag, Truck, Zap, Megaphone, Clock, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Page, Layout, Badge, Banner } from '@shopify/polaris';

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

const PLAN_LEVELS = {
  'Free': 0,
  'Standard': 1,
  'Pro': 2
};

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { announcements, addAnnouncement, updateAnnouncement, plan } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: 'New Announcement',
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
    roundedCorners: '0px',
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
    stickers: []
  });

  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    if (id) {
      const existing = announcements.find(a => a.id === id);
      if (existing) {
        setFormData({ 
          ...(existing.configuration || {}), 
          name: existing.name || '', 
          position: existing.position || 'top',
          enabled: existing.status === 'Published' 
        });
      }
    }
  }, [id, announcements]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    if (preset) setFormData(prev => ({ ...prev, heading: preset }));
  };

  const isFeatureLocked = (requiredPlan) => {
    const currentLevel = PLAN_LEVELS[plan] || 0;
    const requiredLevel = PLAN_LEVELS[requiredPlan] || 0;
    return currentLevel < requiredLevel;
  };

  const FeatureLockBadge = ({ requiredPlan }) => {
    if (!isFeatureLocked(requiredPlan)) return null;
    return (
      <Badge status="warning">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Lock size={10} /> {requiredPlan}
        </div>
      </Badge>
    );
  };

  const getRequiredPlan = () => {
    if (formData.glassmorphism || formData.countdown || formData.gradientBg || formData.bannerStyle !== 'rectangle' || formData.animation !== 'none') return 'Pro';
    if (formData.fontFamily !== 'Inter' || formData.borderStyle !== 'none' || formData.stickers?.length > 0 || formData.buttonStyle !== 'filled') return 'Standard';
    return 'Free';
  };

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    const requiredPlan = getRequiredPlan();
    if (isFeatureLocked(requiredPlan)) {
      alert(`You must upgrade to the ${requiredPlan} plan to use the selected features!`);
      setSaving(false);
      return;
    }

    const payload = {
      name: formData.name,
      status: isDraft ? 'Draft' : formData.enabled ? 'Published' : 'Draft',
      position: formData.position,
      planUsed: requiredPlan,
      targetPages: [],
      configuration: formData
    };
    
    let res;
    if (id) {
      res = await updateAnnouncement(id, payload);
    } else {
      res = await addAnnouncement(payload);
    }
    
    setSaving(false);
    if (res?.success) {
      navigate('/announcements');
    } else {
      alert(res?.error || "Failed to save announcement.");
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
        { content: 'Save Draft', onAction: () => handleSave(true), disabled: saving },
        { content: 'Reset', onAction: () => navigate(0) }
      ]}
    >
      <Layout>
        <Layout.Section>
          {isFeatureLocked(getRequiredPlan()) && (
            <div style={{ marginBottom: '16px' }}>
              <Banner title={`Upgrade to ${getRequiredPlan()} required`} status="warning">
                <p>Your current configuration uses features that are locked on the {plan} plan.</p>
              </Banner>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-6)', height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
            {/* Left Panel - Editor */}
            <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                {['Content', 'Design', 'Targeting', 'Scheduling'].map(tab => (
                  <button 
                    key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
                    style={{
                      flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer',
                      fontWeight: activeTab === tab.toLowerCase() ? 'bold' : 'normal',
                      borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--color-primary)' : '2px solid transparent',
                      color: activeTab === tab.toLowerCase() ? 'var(--color-primary)' : 'var(--color-text)'
                    }}
                  >{tab}</button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-6)' }}>
                {activeTab === 'content' && (
                  <>
                    <h3 className="h3" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      Basic Info <Badge status="success">Free</Badge>
                    </h3>
                    <div className="form-group">
                      <label className="form-label">Internal Name</label>
                      <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Heading Preset</label>
                        <select className="form-input" onChange={handlePresetChange}>
                          <option value="">Select preset...</option>
                          {HEADING_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Custom Heading</label>
                        <input type="text" className="form-input" name="heading" value={formData.heading} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description Message</label>
                      <textarea className="form-input" name="message" value={formData.message} onChange={handleChange} rows="2" />
                    </div>
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Button Text</label>
                        <input type="text" className="form-input" name="buttonText" value={formData.buttonText} onChange={handleChange} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Button URL</label>
                        <input type="text" className="form-input" name="customUrl" value={formData.customUrl} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Banner Position</label>
                      <select className="form-input" name="position" value={formData.position} onChange={handleChange}>
                        <option value="top">Top of page</option>
                        <option value="bottom">Bottom of page</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'design' && (
                  <>
                    <h3 className="h3" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      Basic Design <Badge status="success">Free</Badge>
                    </h3>
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

                    <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                    <h3 className="h3" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      Standard Features <FeatureLockBadge requiredPlan="Standard" />
                    </h3>
                    
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Font Family</label>
                        <select className="form-input" name="fontFamily" value={formData.fontFamily} onChange={handleChange} disabled={isFeatureLocked('Standard')}>
                          <option value="Inter">Inter (Free)</option>
                          <option value="Roboto">Roboto</option>
                          <option value="serif">Serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Button Style</label>
                        <select className="form-input" name="buttonStyle" value={formData.buttonStyle} onChange={handleChange} disabled={isFeatureLocked('Standard')}>
                          <option value="filled">Filled (Free)</option>
                          <option value="outline">Outline</option>
                          <option value="ghost">Ghost</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Border Style</label>
                        <select className="form-input" name="borderStyle" value={formData.borderStyle} onChange={handleChange} disabled={isFeatureLocked('Standard')}>
                          <option value="none">None (Free)</option>
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Border Color</label>
                        <input type="color" className="form-input" name="borderColor" value={formData.borderColor} onChange={handleChange} style={{ height: '40px', padding: '4px' }} disabled={isFeatureLocked('Standard')} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Add Stickers</label>
                      <div className="flex gap-2 flex-wrap">
                        {['SALE', 'NEW', 'HOT'].map(sticker => (
                          <button 
                            key={sticker}
                            className="btn btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '12px', opacity: isFeatureLocked('Standard') ? 0.5 : 1 }}
                            disabled={isFeatureLocked('Standard')}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                stickers: [...(prev.stickers || []), { id: Date.now(), text: sticker, x: 10, y: -15, color: '#FF0000' }]
                              }))
                            }}
                          >+ {sticker}</button>
                        ))}
                      </div>
                    </div>

                    <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                    <h3 className="h3" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      Pro Features <FeatureLockBadge requiredPlan="Pro" />
                    </h3>

                    <div className="form-group">
                      <label className="form-label">Gradient Background (CSS)</label>
                      <input type="text" className="form-input" name="gradientBg" value={formData.gradientBg} onChange={handleChange} placeholder="e.g. linear-gradient(90deg, #fff, #000)" disabled={isFeatureLocked('Pro')} />
                    </div>

                    <div className="flex gap-4">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Banner Shape</label>
                        <select className="form-input" name="bannerStyle" value={formData.bannerStyle} onChange={handleChange} disabled={isFeatureLocked('Pro')}>
                          <option value="rectangle">Full Width (Free)</option>
                          <option value="pill">Floating Pill</option>
                          <option value="toast">Notification Toast</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Animation</label>
                        <select className="form-input" name="animation" value={formData.animation} onChange={handleChange} disabled={isFeatureLocked('Pro')}>
                          <option value="none">None (Free)</option>
                          <option value="fade">Fade In</option>
                          <option value="slide">Slide Down</option>
                          <option value="pulse">Pulse</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group flex items-center justify-between" style={{ marginTop: '16px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Glassmorphism (Blur Effect)</label>
                      <label className="switch">
                        <input type="checkbox" name="glassmorphism" checked={formData.glassmorphism} onChange={handleChange} disabled={isFeatureLocked('Pro')} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'targeting' && (
                  <div className="text-muted text-center" style={{ padding: '40px' }}>
                    <p style={{ marginBottom: '8px' }}>Targeting features coming soon!</p>
                    <p className="text-small">Device targeting, Page targeting, and Geo targeting will appear here.</p>
                  </div>
                )}

                {activeTab === 'scheduling' && (
                  <div className="text-muted text-center" style={{ padding: '40px' }}>
                    <p style={{ marginBottom: '8px' }}>Smart Scheduling coming soon!</p>
                    <p className="text-small">Start/End dates and recurring schedules will appear here.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center" style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                <div>
                  <div className="font-medium">Enable Banner on Store</div>
                  <div className="text-small text-muted">Publish status</div>
                </div>
                <label className="switch">
                  <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleChange} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Right Panel - Storefront Preview */}
            <div className="card" style={{ flex: '1.5', display: 'flex', flexDirection: 'column', backgroundColor: '#F3F4F6', padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Store size={16} className="text-muted" />
                  <span className="text-small font-medium text-muted">Live Preview</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setPreviewMode('desktop')} style={{ padding: '4px 8px', background: previewMode === 'desktop' ? '#E5E7EB' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Desktop</button>
                  <button onClick={() => setPreviewMode('mobile')} style={{ padding: '4px 8px', background: previewMode === 'mobile' ? '#E5E7EB' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mobile</button>
                </div>
              </div>
              
              <div style={{ flex: 1, position: 'relative', overflowY: 'auto', backgroundColor: 'white', margin: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', width: previewMode === 'mobile' ? '375px' : 'auto', alignSelf: previewMode === 'mobile' ? 'center' : 'stretch' }}>
                
                {/* Top Banner */}
                {formData.enabled && formData.position === 'top' && (
                  <div 
                    style={{ 
                    background: formData.glassmorphism ? `${formData.bgColor}CC` : (formData.gradientBg || formData.bgColor), 
                    backdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                    color: formData.textColor,
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: formData.fontSize || '14px',
                    fontWeight: formData.fontWeight || 'normal',
                    textAlign: 'center',
                    fontFamily: formData.fontFamily,
                    borderRadius: formData.bannerStyle === 'pill' ? '9999px' : (formData.bannerStyle === 'toast' ? '8px' : '0'),
                    border: formData.borderStyle !== 'none' ? `${formData.borderWidth} ${formData.borderStyle} ${formData.borderColor}` : 'none',
                    flexWrap: 'wrap',
                    margin: formData.bannerStyle !== 'rectangle' ? '16px auto' : '0',
                    width: formData.bannerStyle === 'toast' ? '320px' : (formData.bannerStyle === 'pill' ? 'fit-content' : '100%'),
                    position: formData.bannerStyle === 'toast' ? 'absolute' : 'relative',
                    top: formData.bannerStyle === 'toast' ? '16px' : 'auto',
                    right: formData.bannerStyle === 'toast' ? '16px' : 'auto',
                    zIndex: 50
                  }}>
                    {formData.stickers?.map(sticker => (
                      <div key={sticker.id} style={{ position: 'absolute', top: `${sticker.y}px`, left: `${sticker.x}%`, backgroundColor: sticker.color, color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', transform: 'rotate(-5deg)', zIndex: 60, whiteSpace: 'nowrap' }}>
                        {sticker.text}
                      </div>
                    ))}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      {IconComponent && <IconComponent size={18} />}
                      {formData.heading && <span style={{ fontWeight: 'bold' }}>{formData.heading}</span>}
                      {formData.message && <span>{formData.message}</span>}
                    </div>

                    {formData.buttonText && (
                      <button style={{
                        backgroundColor: formData.buttonStyle === 'outline' || formData.buttonStyle === 'ghost' ? 'transparent' : formData.btnColor,
                        color: formData.buttonStyle === 'outline' || formData.buttonStyle === 'ghost' ? formData.btnColor : 'white',
                        border: formData.buttonStyle === 'outline' ? `1px solid ${formData.btnColor}` : 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        {formData.buttonText}
                      </button>
                    )}
                  </div>
                )}

                {/* Mock Store */}
                <header style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '20px' }}>My Store</div>
                  {previewMode === 'desktop' && (
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                      <span>Home</span>
                      <span>Catalog</span>
                      <span>Contact</span>
                    </div>
                  )}
                </header>

                <div style={{ backgroundColor: '#F9FAFB', padding: '60px 20px', textAlign: 'center', flex: 1 }}>
                  <h2 style={{ fontSize: previewMode === 'mobile' ? '24px' : '32px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome to our store</h2>
                  <p style={{ color: '#6B7280', marginBottom: '24px' }}>Discover our amazing products</p>
                  <button style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', borderRadius: '4px' }}>Shop All</button>
                </div>

                {/* Bottom Banner */}
                {formData.enabled && formData.position === 'bottom' && (
                  <div 
                    style={{ 
                    background: formData.glassmorphism ? `${formData.bgColor}CC` : (formData.gradientBg || formData.bgColor), 
                    backdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: formData.glassmorphism ? 'blur(10px)' : 'none',
                    color: formData.textColor,
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: formData.fontSize || '14px',
                    fontWeight: formData.fontWeight || 'normal',
                    textAlign: 'center',
                    fontFamily: formData.fontFamily,
                    borderRadius: formData.bannerStyle === 'pill' ? '9999px' : (formData.bannerStyle === 'toast' ? '8px' : '0'),
                    border: formData.borderStyle !== 'none' ? `${formData.borderWidth} ${formData.borderStyle} ${formData.borderColor}` : 'none',
                    flexWrap: 'wrap',
                    position: 'absolute',
                    bottom: formData.bannerStyle !== 'rectangle' ? '16px' : '0',
                    right: formData.bannerStyle === 'toast' ? '16px' : 'auto',
                    left: formData.bannerStyle === 'pill' ? '50%' : (formData.bannerStyle === 'toast' ? 'auto' : '0'),
                    transform: formData.bannerStyle === 'pill' ? 'translateX(-50%)' : 'none',
                    width: formData.bannerStyle === 'toast' ? '320px' : (formData.bannerStyle === 'pill' ? 'fit-content' : '100%'),
                    zIndex: 50
                  }}>
                    {formData.stickers?.map(sticker => (
                      <div key={sticker.id} style={{ position: 'absolute', top: `${sticker.y}px`, left: `${sticker.x}%`, backgroundColor: sticker.color, color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', transform: 'rotate(-5deg)', zIndex: 60, whiteSpace: 'nowrap' }}>
                        {sticker.text}
                      </div>
                    ))}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      {IconComponent && <IconComponent size={18} />}
                      {formData.heading && <span style={{ fontWeight: 'bold' }}>{formData.heading}</span>}
                      {formData.message && <span>{formData.message}</span>}
                    </div>

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
                )}
              </div>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
