import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, announcements } = useAppContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    ctr: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { 'x-merchant-id': user?.id }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchAnalytics();
    }
  }, [user]);

  const activeCount = announcements.filter(a => a.status === 'Active').length;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 className="h1">Welcome back, {user?.merchantName || 'Merchant'} 👋</h1>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>Here's what's happening with your store today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/templates')}>Create Announcement</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
        <div className="card">
          <div className="text-muted text-small font-medium">Total Announcements</div>
          <div className="h1" style={{ marginTop: 'var(--spacing-2)' }}>{announcements.length}</div>
        </div>
        <div className="card">
          <div className="text-muted text-small font-medium">Active Announcements</div>
          <div className="h1" style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-primary)' }}>{activeCount}</div>
        </div>
        <div className="card">
          <div className="text-muted text-small font-medium">Total Views</div>
          <div className="h1" style={{ marginTop: 'var(--spacing-2)' }}>{stats.totalViews}</div>
        </div>
        <div className="card">
          <div className="text-muted text-small font-medium">Average CTR</div>
          <div className="h1" style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-success)' }}>{stats.ctr}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
        <div className="card" style={{ flex: 2 }}>
          <h2 className="h2" style={{ marginBottom: 'var(--spacing-4)' }}>Performance Overview</h2>
          {loading ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart...</div>
          ) : (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'var(--color-background)' }} />
                  <Bar dataKey="views" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="clicks" fill="var(--color-success)" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-4)' }}>
            <h2 className="h2">Recent Banners</h2>
            <button className="btn btn-outline text-small" onClick={() => navigate('/announcements')}>View All</button>
          </div>
          
          <div className="flex-col gap-4">
            {announcements.slice(0, 5).map(ann => (
              <div key={ann.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div className="font-medium">{ann.name}</div>
                  <div className="text-muted text-small">{ann.analytics?.views || 0} views</div>
                </div>
                <span className={`badge ${ann.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{ann.status}</span>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="text-muted text-small">No announcements yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
