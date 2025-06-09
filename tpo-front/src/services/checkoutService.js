import api from "./api"

const checkoutService = {
    confirmCheckout: async () => { 
        try {
            const response = await api.post('/cart/checkout')
            return response.data
        } catch(error) { 
            throw new checkoutService._handleError(error)
        }
    },

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
}

export default checkoutService