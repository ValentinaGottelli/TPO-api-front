import api from "../api"

const listaProductosTest = {

    getProductListTest: 
    async () => {
        try {
            const response = await api.get('/products')
            return response.data.products
        }catch(error) {
            throw new Error(error.message)
        }
    },

    getProductListById:
    async (userId) => {
        try{
            const response = await api.get(`/products/user/${userId}`)
            return response.data.products
        }catch(error) {
            throw new Error(error.message)
        }
    }
}

export default listaProductosTest;