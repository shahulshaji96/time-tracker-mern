import React from 'react';

export default function Input({ label, error, ...props }) {
  return (
    <label className="stack" style={{ width: '100%' }}>
      {label && (
        <span style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</span>
      )}
      <input className="input" {...props} />
      {error && <small style={{ color: 'var(--danger)' }}>{error}</small>}
    </label>
  );
}
