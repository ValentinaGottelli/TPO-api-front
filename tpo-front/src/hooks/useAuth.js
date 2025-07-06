import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  initializeAuth,
  clearError,
  updateUser,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
  selectUserRole,
  selectUserId,
  selectHasRole
} from '../store/slices/authSlice';

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const initialized = useAppSelector(selectIsInitialized);

  // Actions
  const login = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Redirect después del logout
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch]);

  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const updateUserData = useCallback((userData) => {
    dispatch(updateUser(userData));
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper functions
  const hasRole = useCallback((requiredRole) => {
    if (!user || !user.role) return false;
    
    const roleHierarchy = {
      'ADMIN': 3,
      'VENDEDOR': 2,
      'COMPRADOR': 1
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }, [user]);

  const getUserRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  const getUserId = useCallback(() => {
    return user?.id || null;
  }, [user]);

  const getRedirectPath = useCallback((userRole) => {
    const role = userRole || user?.role;
    
    switch (role) {
      case 'VENDEDOR':
        return '/seller';
      case 'COMPRADOR':
        return '/dashboard';
      case 'ADMIN':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  }, [user?.role]);

  return {
    // Estado
    user,
    loading,
    isAuthenticated,
    error,
    initialized,
    
    // Acciones
    login,
    register,
    logout,
    initialize,
    updateUser: updateUserData,
    clearError: clearAuthError,
    
    // Utilidades
    hasRole,
    getUserRole,
    getUserId,
    getRedirectPath,
  };
};