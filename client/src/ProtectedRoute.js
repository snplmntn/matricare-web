import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Assuming user role is stored in local storage

  const isAuthenticated = !!token; // Check if token exists
  const hasRequiredRole = userRole === requiredRole; // Check if user role matches required role

  return isAuthenticated && hasRequiredRole ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
