import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const loginData = {
        username: credentials.email,
        password: credentials.password
      };
      
      const response = await api.post('/user/authenticate', loginData);
      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        throw new Error('Datos de usuario inválidos');
      }
      
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role || 'COMPRADOR'
      };
      
      return {
        user: userData,
        token: access_token,
        success: true
      };
      
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        throw new Error('Datos de usuario inválidos');
      }
      
      const userDataToReturn = {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role || userData.role || 'COMPRADOR'
      };
      
      return {
        user: userDataToReturn,
        token: access_token,
        success: true
      };
      
    } catch (error) {
      throw authService._handleError(error);
    }
  },

  logout: async () => {
    try {
      await api.post('/user/logout');
    } catch (error) {
      console.warn('Error durante logout:', error.message);
    }
  },

  verifyToken: async (token) => {
    try {
      const originalAuth = api.defaults.headers.common['Authorization'];
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/user/verify');
      
      if (originalAuth) {
        api.defaults.headers.common['Authorization'] = originalAuth;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
      
      return response.data;
    } catch (error) {
      delete api.defaults.headers.common['Authorization'];
      throw authService._handleError(error);
    }
  },

  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },

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