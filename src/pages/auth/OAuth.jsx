import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function OAuth() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    // Simulate OAuth delay
    const timer = setTimeout(() => {
      // If plan is 'Free' they just installed it. We can route to Choose Plan or Dashboard
      navigate('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-layout">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <div className="h2">Connecting to Shopify...</div>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-2)' }}>Authorizing {user?.shopDomain}</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--spacing-8) 0' }}>
          {/* Simple spinner */}
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-primary-light)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
        
        <p className="text-small text-muted">You will be redirected automatically.</p>
        
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
