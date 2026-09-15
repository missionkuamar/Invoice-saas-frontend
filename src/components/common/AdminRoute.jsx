// frontend/src/components/common/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  
  // ✅ Check if user is authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // ✅ Check if user has admin role
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default AdminRoute;