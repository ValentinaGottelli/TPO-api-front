import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check if user is already authenticated
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Optionally verify token with server
        // await verifyToken();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
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
      console.error('Login failed:', error);
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
      console.error('Registration failed:', error);
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
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const updateUserData = (newUserData) => {
    try {
      setUser(newUserData);
      authService.updateUser(newUserData);
      return true;
    } catch (error) {
      console.error('Failed to update user data:', error);
      return false;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const response = await authService.refreshToken();
      const userData = response.user || response;
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      console.error('Token refresh failed:', error);
      await handleLogout();
      return { success: false, error: error.message };
    }
  };

  // Helper methods
  const hasRole = (requiredRole) => {
    return authService.hasRole(requiredRole);
  };

  const getUserRole = () => {
    return authService.getUserRole();
  };

  const contextValue = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: updateUserData,
    refreshToken: refreshAuthToken,
    
    // Utilities
    hasRole,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
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
      return <div>Loading...</div>; // Or your loading component
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