import { useEffect, useState } from "react"
import cartService  from '../../../services/cartService'

const useGetCart = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const result = await cartService.getCartC();
                console.log(result)
                setCart(result);
            } catch (error) {
                console.log(error)
                setError(error);
            }
        }

        fetchCart();
    }, []);
    
    return { cart, error };
};
 
export default useGetCart