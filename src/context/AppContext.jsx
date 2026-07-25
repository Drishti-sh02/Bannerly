import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [plan, setPlan] = useState('Free');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Headers for API calls
  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'x-merchant-id': user?.id || ''
    };
  }, [user]);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchProfile();
      fetchAnnouncements();
    }
  }, [isAuthenticated, user?.id]);

  // Sync basic auth state
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/merchant/profile', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.subscription?.plan || 'Free');
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/announcements', { headers: getHeaders() });
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

  const login = async (userData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const merchant = await res.json();
        setUser(merchant);
        setIsAuthenticated(true);
        setPlan(merchant.subscription?.plan || 'Free');
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPlan('Free');
    setAnnouncements([]);
  };

  const addAnnouncement = async (announcement) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: getHeaders(),
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
      const res = await fetch(`/api/announcements/${id}`, {
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
      const res = await fetch(`/api/announcements/${id}`, {
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
      const res = await fetch(`/api/announcements/${id}/duplicate`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        const copy = await res.json();
        setAnnouncements(prev => [copy, ...prev]);
      }
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
      isAuthenticated, user, login, logout,
      plan, updateSubscription,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, duplicateAnnouncement,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
