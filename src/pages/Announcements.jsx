import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Copy, Eye, Activity, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Page, Layout, Tabs, Card, Badge, Modal, TextContainer } from '@shopify/polaris';

export default function Announcements() {
  const navigate = useNavigate();
  const { announcements, fetchAnnouncements, deleteAnnouncement, duplicateAnnouncement, updateAnnouncement, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const tabs = [
    { id: 'all', content: 'All' },
    { id: 'drafts', content: 'Drafts' },
    { id: 'published', content: 'Published' },
    { id: 'scheduled', content: 'Scheduled' },
    { id: 'archived', content: 'Archived' },
  ];

  const filteredAnnouncements = (announcements || [])
    .filter(a => {
      if (selectedTab === 1) return a.status === 'Draft';
      if (selectedTab === 2) return a.status === 'Published';
      if (selectedTab === 3) return a.status === 'Scheduled';
      if (selectedTab === 4) return a.status === 'Archived';
      return true;
    })
    .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleStatusChange = async (id, newStatus) => {
    await updateAnnouncement(id, { status: newStatus });
  };

  const getBadgeStatus = (status) => {
    switch (status) {
      case 'Published': return 'success';
      case 'Scheduled': return 'info';
      case 'Archived': return 'critical';
      default: return 'warning';
    }
  };

  return (
    <Page 
      title="Announcements" 
      subtitle="Manage all your active and scheduled announcements."
      primaryAction={{
        content: 'Create Banner',
        onAction: () => navigate('/create')
      }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--p-color-border)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--p-color-text-subdued)' }} />
                    <input 
                      type="text" 
                      placeholder="Search announcements..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem 0.5rem 0.5rem 2rem', 
                        border: '1px solid var(--p-color-border)', 
                        borderRadius: '4px',
                        background: 'var(--p-color-bg)'
                      }}
                    />
                  </div>
                  <button style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--p-color-border)', borderRadius: '4px', background: 'white' }}>
                    <Filter size={16} /> Filters
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--p-color-border)', background: 'var(--p-color-bg-subdued)' }}>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Position & Target</th>
                      <th style={{ padding: '1rem' }}>Performance</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>}
                    {!loading && filteredAnnouncements.length === 0 && (
                      <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--p-color-text-subdued)' }}>No announcements found.</td></tr>
                    )}
                    {!loading && filteredAnnouncements.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--p-color-border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '500' }}>{item.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--p-color-text-subdued)' }}>
                            Updated: {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <Badge status={getBadgeStatus(item.status)}>{item.status}</Badge>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>{item.position}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--p-color-text-subdued)' }}>
                            {item.targetPages?.length > 0 ? item.targetPages.join(', ') : 'All Pages'}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Eye size={14} /> {item.views} 
                            <ExternalLink size={14} style={{ marginLeft: '0.5rem' }} /> {item.clicks}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            {item.status === 'Published' ? (
                              <button onClick={() => handleStatusChange(item.id, 'Draft')} title="Unpublish" style={{ padding: '4px', cursor: 'pointer' }}>
                                Unpublish
                              </button>
                            ) : (
                              <button onClick={() => handleStatusChange(item.id, 'Published')} title="Publish" style={{ padding: '4px', cursor: 'pointer' }}>
                                Publish
                              </button>
                            )}
                            <button onClick={() => { setSelectedHistory(item); setHistoryModalOpen(true); }} title="History" style={{ padding: '4px', cursor: 'pointer' }}><Activity size={16} /></button>
                            <button onClick={() => duplicateAnnouncement(item.id)} title="Duplicate" style={{ padding: '4px', cursor: 'pointer' }}><Copy size={16} /></button>
                            <button onClick={() => navigate(`/edit/${item.id}`)} title="Edit" style={{ padding: '4px', cursor: 'pointer' }}><Edit size={16} /></button>
                            <button onClick={() => { if(window.confirm('Delete this banner?')) deleteAnnouncement(item.id) }} title="Delete" style={{ padding: '4px', cursor: 'pointer', color: 'red' }}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Publishing History"
      >
        <Modal.Section>
          <TextContainer>
            {selectedHistory?.history?.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {selectedHistory.history.map(entry => (
                  <li key={entry.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--p-color-border)' }}>
                    <Badge status={getBadgeStatus(entry.status)}>{entry.status}</Badge>
                    <span style={{ marginLeft: '1rem', color: 'var(--p-color-text-subdued)', fontSize: '0.875rem' }}>
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history available.</p>
            )}
          </TextContainer>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
