import api from './api';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'marketplace_user',
  REFRESH_TOKEN: 'refresh_token'
};

const authService = {
  // Authentication methods
  login: async (credentials) => {
    try {
      // Transform email to username for backend compatibility
      const loginData = {
        username: credentials.email,
        password: credentials.password
      };

      const response = await api.post('/user/authenticate', loginData);
      const { token, user, refreshToken } = response.data;

      // Store tokens and user data
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      const { token, user, refreshToken } = response.data;

      // Store tokens and user data
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  logout: async () => {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      const token = authService.getToken();
      if (token) {
        await api.post('/user/logout');
      }
    } catch (error) {
      console.warn('Logout endpoint failed:', error);
    } finally {
      // Always clear local storage
      authService.clearStorage();
    }
  },

  // Token management
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/user/refresh', { refreshToken });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      authService.clearStorage();
      throw authService._handleError(error);
    }
  },

  // User data management
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  },

  updateUser: (userData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  },

  // Utility methods
  isAuthenticated: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  getUserId: () => {
    const user = authService.getCurrentUser();
    return user?.id || null;
  },

  hasRole: (requiredRole) => {
    const userRole = authService.getUserRole();
    if (!userRole || !requiredRole) return false;
    
    // Define role hierarchy
    const roleHierarchy = {
      'ADMIN': 3,
      'VENDEDOR': 2,
      'COMPRADOR': 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  },

  clearStorage: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Private helper methods
  _handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos inválidos');
        case 401:
          return new Error('Credenciales inválidas');
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        case 404:
          return new Error('Servicio no encontrado');
        case 409:
          return new Error(data.message || 'El usuario ya existe');
        case 422:
          return new Error(data.message || 'Datos de entrada inválidos');
        case 500:
          return new Error('Error interno del servidor');
        default:
          return new Error(data.message || `Error ${status}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('No se pudo conectar al servidor. Verifica tu conexión.');
    } else {
      // Other error
      return new Error(error.message || 'Error inesperado');
    }
  }
};

export default authService;