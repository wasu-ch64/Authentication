import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/home'} replace />;
  }

  return children;
};

export default GuestRoute;