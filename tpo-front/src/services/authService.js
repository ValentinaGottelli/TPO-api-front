import api from './api';

const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'marketplace_user'
};

const authService = {
  // Login - retorna datos limpios para Redux
  login: async (credentials) => {
    try {
      const loginData = {
        username: credentials.email,
        password: credentials.password
      };
      
      const response = await api.post('/user/authenticate', loginData);
      const { access_token, user } = response.data;
      
      // Guardar en localStorage
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
        
        // Retornar datos estructurados para Redux
        return {
          user: userData,
          access_token,
          success: true
        };
      }
      
      throw new Error('Datos de usuario inválidos');
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  // Register - retorna datos limpios para Redux
  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      const { access_token, user } = response.data;
      
      // Guardar en localStorage
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
        
        // Retornar datos estructurados para Redux
        return {
          user: userDataToStore,
          access_token,
          success: true
        };
      }
      
      throw new Error('Datos de usuario inválidos');
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  // Logout - limpia todo
  logout: async () => {
    try {
      const token = authService.getToken();
      if (token) {
        await api.post('/user/logout');
      }
    } catch (error) {
      // Ignore logout errors pero limpiar storage
    } finally {
      authService.clearStorage();
    }
  },

  // Verificar si hay datos de autenticación válidos
  // En authService.js debe estar este método:
checkAuthState: () => {
  try {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    if (user && user.id && user.email) {
      return {
        isAuthenticated: true,
        user,
        token
      };
    }
    
    authService.clearStorage();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  } catch (error) {
    authService.clearStorage();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }
},

  // Funciones de utilidad
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
      return userToStore;
    } catch (error) {
      return null;
    }
  },

  clearStorage: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Verificaciones de rol
  hasRole: (userRole, requiredRole) => {
    if (!userRole || !requiredRole) return false;
    
    const roleHierarchy = {
      'ADMIN': 3,
      'VENDEDOR': 2,
      'COMPRADOR': 1
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
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