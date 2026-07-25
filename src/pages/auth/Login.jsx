import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Login() {
  const [shopDomain, setShopDomain] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (shopDomain && email) {
      setLoading(true);
      const success = await login({ shopDomain, shopName: shopName || shopDomain.split('.')[0], email });
      setLoading(false);
      if (success) {
        navigate('/oauth'); 
      }
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '24px', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>
            B
          </div>
          <h1 className="h2">Install Bannerly</h1>
          <p className="text-muted text-small" style={{ marginTop: 'var(--spacing-2)' }}>Enter your Shopify store details.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Shop Domain (.myshopify.com)</label>
            <input type="text" className="form-input" value={shopDomain} onChange={e => setShopDomain(e.target.value)} required placeholder="mystore.myshopify.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Store Name (Optional)</label>
            <input type="text" className="form-input" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="My Store" />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@mystore.com" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--spacing-4)' }} disabled={loading}>
            {loading ? 'Installing...' : 'Install App'}
          </button>
        </form>
      </div>
    </div>
  );
}
