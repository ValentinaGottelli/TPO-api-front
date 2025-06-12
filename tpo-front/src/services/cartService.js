import api from "./api";

const cartService = {
  // Obtener el carrito
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return formatCartResponse(response.data.products) || [];
    } catch (error) {
      throw cartService._handleError(error);
    }
  },
  // Agregar producto al carrito
  addItemToCart: async (cartItemData) => {
    try {
      const response = await api.post("/cart/items", cartItemData);
      return formatCartResponse(response.data.products);
    } catch (error) {
      throw cartService._handleError(error);
    }
  },

  // Actualizar producto en el carrito
  updateProduct: async (productId, cartItemData) => {
    try {
      const response = await api.put(`/cart/items/${productId}`, cartItemData);
      return formatCartResponse(response.data.products);
    } catch (error) {
      throw cartService._handleError(error);
    }
  },

  // Eliminar producto del carrito
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return formatCartResponse(response.data.products);
    } catch (error) {
      throw cartService._handleError(error);
    }
  },

  // Manejo de errores
  _handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const messages = {
        400: "Datos inválidos",
        401: "No tienes autorización para realizar esta acción",
        403: "No tienes permisos para realizar esta acción",
        404: "Recurso no encontrado",
        409: "Conflicto en los datos",
        413: "El archivo es demasiado grande",
        422: "Datos de entrada inválidos",
        500: "Error interno del servidor",
      };
      return new Error(data.message || messages[status] || `Error ${status}`);
    } else if (error.request) {
      return new Error(
        "No se pudo conectar al servidor. Verifica tu conexión."
      );
    } else {
      return new Error(error.message || "Error inesperado");
    }
  },
};

const formatCartResponse = (products) => {
  return products.map((p) => ({ ...p.product, cartQuantity: p.quantity }));
};

export default cartService;
