import api from './api';

const productService = {
  // Subir imagen
  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/images/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Crear producto
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Obtener productos del usuario
  getUserProducts: async (userId) => {
    try {
      const response = await api.get(`/products/user/${userId}`);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Obtener categorías
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Actualizar producto
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Eliminar producto
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Manejo de errores
  _handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos inválidos');
        case 401:
          return new Error('No tienes autorización para realizar esta acción');
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        case 404:
          return new Error('Recurso no encontrado');
        case 409:
          return new Error(data.message || 'Conflicto en los datos');
        case 413:
          return new Error('El archivo es demasiado grande');
        case 422:
          return new Error(data.message || 'Datos de entrada inválidos');
        case 500:
          return new Error('Error interno del servidor');
        default:
          return new Error(data.message || `Error ${status}`);
      }
    } else if (error.request) {
      return new Error('No se pudo conectar al servidor. Verifica tu conexión.');
    } else {
      return new Error(error.message || 'Error inesperado');
    }
  }
};

export default productService;