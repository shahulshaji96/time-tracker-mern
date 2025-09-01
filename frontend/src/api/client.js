import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// ✅ always pull token fresh from localStorage using consistent key
client.interceptors.request.use(
  (cfg) => {
    const t = localStorage.getItem('accessToken'); // <-- changed here
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
  },
  (err) => Promise.reject(err)
);

export function setToken(t) {
  if (t) {
    localStorage.setItem('accessToken', t); // <-- changed here
  } else {
    localStorage.removeItem('accessToken'); // <-- changed here
  }
}

// ✅ always return res.data
export const get = async (url, params) => {
  const res = await client.get(url, { params });
  return res.data;
};

export const post = async (url, data) => {
  const res = await client.post(url, data);
  return res.data;
};

export const put = async (url, data) => {
  const res = await client.put(url, data);
  return res.data;
};

export const del = async (url) => {
  const res = await client.delete(url);
  return res.data;
};

export default client;
