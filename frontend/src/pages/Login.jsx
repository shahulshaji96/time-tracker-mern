import React, { useEffect } from 'react';
import LoginForm from '../components/Auth/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return <LoginForm />;
}
