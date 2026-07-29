import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('free');

  const getHeaders = () => {
    return { 'Content-Type': 'application/json' };
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/app/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (announcement) => {
    try {
      const res = await fetch('/app/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement)
      });
      if (res.ok) {
        const newAnn = await res.json();
        setAnnouncements(prev => [newAnn, ...prev]);
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const updateAnnouncement = async (id, updatedData) => {
    try {
      const res = await fetch(`/app/api/announcements/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setAnnouncements(prev => prev.map(ann => ann.id === id ? updated : ann));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      const res = await fetch(`/app/api/announcements/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const duplicateAnnouncement = async (id) => {
    try {
      const existing = announcements.find(a => a.id === id);
      if (!existing) return;
      const { id: _, history, createdAt, updatedAt, publishedAt, scheduledAt, ...copyData } = existing;
      copyData.name = copyData.name + " (Copy)";
      copyData.status = "Draft";
      await addAnnouncement(copyData);
    } catch (err) {
      console.error("Duplicate failed", err);
    }
  };


  const updateSubscription = async (newPlan) => {
    try {
      const res = await fetch('/api/subscription', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ plan: newPlan })
      });
      if (res.ok) {
        setPlan(newPlan);
      }
    } catch (err) {
      console.error("Update subscription failed", err);
    }
  };

  return (
    <AppContext.Provider value={{
      plan, updateSubscription,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, duplicateAnnouncement, fetchAnnouncements,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
