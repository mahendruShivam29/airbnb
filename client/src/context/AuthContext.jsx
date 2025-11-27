import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on first load
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Try to fetch from Traveler service first
        try {
          const r = await api.get('/traveler/auth/me');
          if (alive) {
            setUser(r.data.user);
            return;
          }
        } catch (e) {
          // If failed, try Owner service
          try {
            const r = await api.get('/owner/auth/me');
            if (alive) setUser(r.data.user);
          } catch {
            if (alive) setUser(null);
          }
        }
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const login = async (email, password) => {
    // This function might be unused if Auth.jsx handles login directly
    // But if used, we'd need to know the role. 
    // For now, we'll try traveler first.
    try {
      await api.post('/traveler/auth/login', { email, password });
      const r = await api.get('/traveler/auth/me');
      setUser(r.data.user);
    } catch {
      await api.post('/owner/auth/login', { email, password });
      const r = await api.get('/owner/auth/me');
      setUser(r.data.user);
    }
  };

  const logout = async () => {
    try { await api.post('/traveler/auth/logout'); } catch { }
    try { await api.post('/owner/auth/logout'); } catch { }
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
