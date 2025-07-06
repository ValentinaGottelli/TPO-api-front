import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthRedux } from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  redirectTo = '/auth' 
}) => {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    initialized 
  } = useAuthRedux();

  // Mostrar loading mientras se inicializa la auth
  if (loading || !initialized) {
    return <LoadingScreen />;
  }

  // Si requiere autenticación pero no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si NO requiere autenticación pero está autenticado (ej: login page)
  if (!requireAuth && isAuthenticated) {
    // Redirigir a dashboard según rol
    const getRedirectPath = (userRole) => {
      switch (userRole) {
        case 'VENDEDOR':
          return '/seller';
        case 'COMPRADOR':
        case 'ADMIN':
          return '/dashboard';
        default:
          return '/dashboard';
      }
    };
    
    return <Navigate to={getRedirectPath(user?.role)} replace />;
  }

  // Verificar roles si se especificaron
  if (requireAuth && allowedRoles.length > 0) {
    const userRole = user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirigir a dashboard por defecto si no tiene el rol
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default AuthGuard;