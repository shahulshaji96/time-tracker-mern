import React from 'react';
import Button from './Button.jsx';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: 520, maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}
