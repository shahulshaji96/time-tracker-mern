import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const cls = ['btn'];
  if (variant === 'primary') cls.push('btn-primary');
  if (variant === 'secondary') cls.push('btn-secondary');
  if (variant === 'danger') cls.push('btn-danger');
  if (size === 'sm') cls.push('btn-sm');
  return (
    <button className={cls.join(' ')} {...props}>
      {children}
    </button>
  );
}
