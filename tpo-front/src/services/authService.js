import api from './api';

const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'marketplace_user'
};

const authService = {
  login: async (credentials) => {
    try {
      const loginData = {
        username: credentials.email,
        password: credentials.password
      };

      const response = await api.post('/user/authenticate', loginData);
      const { access_token, user } = response.data;

      if (access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
      }
      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role || 'COMPRADOR'
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }

      return response.data;
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      const { access_token, user } = response.data;

      if (access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
      }
      if (user) {
        const userDataToStore = {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role || userData.role || 'COMPRADOR'
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userDataToStore));
      }

      return response.data;
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  logout: async () => {
    try {
      const token = authService.getToken();
      if (token) {
        await api.post('/user/logout');
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      authService.clearStorage();
    }
  },

  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      if (user && user.id && user.email) {
        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          lastName: user.lastName || '',
          role: user.role || 'COMPRADOR'
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  updateUser: (userData) => {
    try {
      const userToStore = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        role: userData.role || 'COMPRADOR'
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));
      return true;
    } catch (error) {
      return false;
    }
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    return !!(user && (token || user.id));
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

  _handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const messages = {
        400: 'Datos invalidos',
        401: 'Credenciales invalidas',
        403: 'No tienes permisos para realizar esta accion',
        404: 'Servicio no encontrado',
        409: 'El usuario ya existe',
        422: 'Datos de entrada invalidos',
        500: 'Error interno del servidor'
      };
      return new Error(data.message || messages[status] || `Error ${status}`);
    } else if (error.request) {
      return new Error('No se pudo conectar al servidor. Verifica tu conexion.');
    } else {
      return new Error(error.message || 'Error inesperado');
    }
  }
};

export default authService;