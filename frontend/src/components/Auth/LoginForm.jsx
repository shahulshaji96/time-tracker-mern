import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await login(email, password);
      if (!user) throw new Error('Invalid credentials');

      // ✅ redirect to correct route
      if (user.role === 'HR_ADMIN') navigate('/hr');
      else if (user.role === 'MANAGER') navigate('/manager');
      else navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className="app container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Sign In</h2>
        <form onSubmit={handleSubmit} className="stack">
          <input
            type="email"
            className="input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '8px' }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
