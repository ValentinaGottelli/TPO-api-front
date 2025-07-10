import { useEffect, useState, useCallback } from "react"
import { fetchCart, clearCartState } from '../../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
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

export const useCartRedux = () => {
  const dispatch = useDispatch();
  const { cart, error, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const refreshCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch(clearCartState());
  }, [dispatch]);

  return {
    cart,
    error,
    loading,
    refreshCart,
    clearCart,
  };
};