import React, { createContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.js';
import { setToken } from '../api/client.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setToken(token);

    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.me();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Auth check failed', err);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    console.log('Login response:', res.data);

    const token = res?.token; // ✅ backend sends "token"
    if (token) {
      setToken(token);
      localStorage.setItem('accessToken', token);
    }

    if (res?.user) {
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
    }

    return res?.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout failed (ignored)', err);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, setUser, login, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
