import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthPages from '../components/auth/AuthPages';
import GeneralDashboard from '../components/dashboard/GeneralDashboard';
import SellerDashboard from '../components/seller/SellerDashboard';
import LoadingScreen from '../components/common/LoadingScreen';
import ProductsList from '../components/ProductsList';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function RoleBasedRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/dashboard" replace />;
  }

  switch (user.role) {
    case 'VENDEDOR':
      return <Navigate to="/seller" replace />;
    case 'COMPRADOR':
    case 'ADMIN':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPages />} />
      
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute allowedRoles={['VENDEDOR']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <GeneralDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
            <ProductsList />
        }
      />
      
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
