import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router';
import { LayoutTemplate, Megaphone, Eye, ArrowRight } from 'lucide-react';
import { Page, Layout, Text, BlockStack } from '@shopify/polaris';

export default function Dashboard() {
  const { announcements, shop } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/app') ? '/app' : '';

  const merchantName = shop ? shop.replace('.myshopify.com', '') : 'Merchant';
  const activeCount = (announcements || []).filter(a => a.status === 'Active').length;

  return (
    <Page title={`Welcome back, ${merchantName} 👋`} subtitle="Manage your store's banners and announcements.">
      <Layout>
        <Layout.Section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }}>
        
        {/* Card 1: Use Template */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}
          onClick={() => navigate(`${basePath}/create`)}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
            <LayoutTemplate size={24} />
          </div>
          <h2 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Create Banner</h2>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)', flex: 1 }}>Build a custom, high-converting banner for your store using our unified editor.</p>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-primary)', fontSize: '14px' }}>
            Open Editor <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 2: Announcements Created */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}
          onClick={() => navigate(`${basePath}/announcements`)}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
            <Megaphone size={24} />
          </div>
          <h2 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Announcements</h2>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)', flex: 1 }}>You have <strong>{(announcements || []).length}</strong> banners created and <strong>{activeCount}</strong> currently active.</p>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-success)', fontSize: '14px' }}>
            Manage Banners <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 3: Preview */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}
          onClick={() => {
            if (shop) window.open(`https://${shop}`, '_blank');
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
            <Eye size={24} />
          </div>
          <h2 className="h2 font-semibold" style={{ marginBottom: 'var(--spacing-2)' }}>Live Preview</h2>
          <p className="text-muted text-small" style={{ marginBottom: 'var(--spacing-6)', flex: 1 }}>See exactly how your active announcements look on your storefront.</p>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-warning)', fontSize: '14px' }}>
            View Store <ArrowRight size={16} />
          </div>
        </div>

          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
