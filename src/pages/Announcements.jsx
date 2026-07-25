import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Announcements() {
  const navigate = useNavigate();
  const { announcements, deleteAnnouncement, duplicateAnnouncement, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnnouncements = announcements.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 className="h1">Announcements</h1>
          <p className="text-muted" style={{ marginTop: 'var(--spacing-1)' }}>Manage all your active and scheduled announcements.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/templates')}>Create Announcement</button>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-4)' }}>
          <div className="flex items-center gap-2" style={{ width: '300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} className="text-muted" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search announcements..." 
                style={{ paddingLeft: '32px' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-secondary">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th className="text-muted text-small font-medium" style={{ padding: 'var(--spacing-3) 0' }}>Announcement Name</th>
                <th className="text-muted text-small font-medium" style={{ padding: 'var(--spacing-3) 0' }}>Status</th>
                <th className="text-muted text-small font-medium" style={{ padding: 'var(--spacing-3) 0' }}>Position</th>
                <th className="text-muted text-small font-medium" style={{ padding: 'var(--spacing-3) 0' }}>Schedule</th>
                <th className="text-muted text-small font-medium" style={{ padding: 'var(--spacing-3) 0' }}>Performance</th>
                <th className="text-muted text-small font-medium" style={{ padding: 'var(--spacing-3) 0', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>}
              {!loading && filteredAnnouncements.length === 0 && (
                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No announcements found.</td></tr>
              )}
              {!loading && filteredAnnouncements.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--spacing-4) 0' }}>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted text-small">{item.category} • {item.templateName}</div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4) 0' }}>
                    <span className={`badge ${item.status === 'Active' ? 'badge-success' : item.status === 'Scheduled' ? 'badge-primary' : item.status === 'Draft' ? 'badge-warning' : 'badge-danger'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--spacing-4) 0', textTransform: 'capitalize' }} className="text-small">{item.position}</td>
                  <td style={{ padding: 'var(--spacing-4) 0' }} className="text-small">{item.schedule || 'Ongoing'}</td>
                  <td style={{ padding: 'var(--spacing-4) 0' }}>
                    <div className="text-small">
                      <span className="font-medium">{item.analytics?.views || 0}</span> views • <span className="font-medium">{item.analytics?.clicks || 0}</span> clicks
                    </div>
                    <div className="text-muted text-small">CTR: {item.analytics?.ctr || 0}%</div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4) 0', textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-secondary" style={{ padding: '6px' }} title="Duplicate" onClick={() => duplicateAnnouncement(item.id)}><Copy size={14} /></button>
                      <button className="btn btn-secondary" style={{ padding: '6px' }} title="Edit" onClick={() => navigate(`/edit/${item.id}`)}><Edit size={14} /></button>
                      <button className="btn btn-secondary" style={{ padding: '6px', color: 'var(--color-danger)' }} title="Delete" onClick={() => { if(window.confirm('Delete this announcement?')) deleteAnnouncement(item.id) }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
