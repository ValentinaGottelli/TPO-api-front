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

      return response.data; // Retorna { imageUrl: "http://localhost:8080/images/6" }
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

  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data.products || []; // Retorna el array de productos
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Obtener productos del usuario (sin filtrar por ahora, ya que no viene userId en la respuesta)
  getUserProducts: async (userId) => {
    try {
      const response = await api.get('/products');
      const allProducts = response.data.products || [];
      
      // Por ahora retornamos todos los productos
      // TODO: El backend debería devolver userId en cada producto para filtrar correctamente
      return allProducts;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Actualizar producto (si tienes endpoint PUT)
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Eliminar producto (si tienes endpoint DELETE)
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data.products || [];
    } catch (error) {
      throw productService._handleError(error);
    }
  },

  // Manejo de errores
  _handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const messages = {
        400: 'Datos inválidos',
        401: 'No tienes autorización para realizar esta acción',
        403: 'No tienes permisos para realizar esta acción',
        404: 'Recurso no encontrado',
        409: 'Conflicto en los datos',
        413: 'El archivo es demasiado grande',
        422: 'Datos de entrada inválidos',
        500: 'Error interno del servidor'
      };
      return new Error(data.message || messages[status] || `Error ${status}`);
    } else if (error.request) {
      return new Error('No se pudo conectar al servidor. Verifica tu conexión.');
    } else {
      return new Error(error.message || 'Error inesperado');
    }
  }
};

export default productService;
