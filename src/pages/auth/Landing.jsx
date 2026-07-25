import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      <header style={{ padding: 'var(--spacing-6) var(--spacing-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>B</div>
          <span className="h3">Bannerly</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started for Free</button>
        </div>
      </header>

      <main style={{ padding: 'var(--spacing-12) var(--spacing-10)', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Smart Announcement Bars for Shopify</h1>
        <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto var(--spacing-8)' }}>
          Boost your store's conversions with beautiful, highly customizable announcement bars. Engage your customers with targeted offers and flash sales.
        </p>
        <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }} onClick={() => navigate('/login')}>Install Bannerly</button>
      </main>
    </div>
  );
}
