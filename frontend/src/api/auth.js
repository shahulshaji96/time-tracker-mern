import { get, post, setToken } from './client.js';

export const login = async (body) => {
  console.log('Login request body:', body);
  const res = await post('/api/auth/login', body); // ✅ remove extra /api because client.baseURL already has /api
  if (res.token) {
    setToken(res.token); // ✅ use "token" as backend returns
  }
  return res; // contains { token, user }
};

export const logout = async () => {
  setToken(null); // clear token
  return post('/auth/logout', {});
};

export const me = () => get('/api/auth/me');
