import React, { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((msg, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'grid',
          gap: 8,
          zIndex: 50,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="card"
            style={{
              borderColor:
                t.type === 'error'
                  ? 'var(--danger)'
                  : t.type === 'success'
                    ? 'var(--success)'
                    : 'var(--border)',
            }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
