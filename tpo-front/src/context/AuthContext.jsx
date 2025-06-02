import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      if (isAuth && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else if (currentUser && currentUser.id) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        authService.clearStorage();
      }
    } catch (error) {
      await handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await authService.login(credentials);
      const userData = response.user || response;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authService.register(userData);
      const newUser = response.user || response;
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, data: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  };

  const updateUserData = (newUserData) => {
    try {
      setUser(newUserData);
      authService.updateUser(newUserData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return authService.hasRole(requiredRole);
  };

  const getUserRole = () => {
    return user?.role || authService.getUserRole();
  };

  const getRedirectPath = (userRole) => {
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
  };

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: updateUserData,
    hasRole,
    getUserRole,
    getRedirectPath,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const withAuth = (WrappedComponent, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, hasRole, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    if (requiredRole && !hasRole(requiredRole)) {
      return <div>You don't have permission to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
};