import { useState } from "react"
import checkoutService from "../../../services/checkoutService"
import { useDispatch, useSelector } from 'react-redux';
import { confirmCheckout, clearCheckoutState } from '../../store/slices/checkoutSlice';
import { useCallback } from 'react';

const useCheckout = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const confirmCheckout = async () => {
        setLoading(true)
        setError(null)
        setResponse(null)

        try {
            const result = await checkoutService.confirmCheckout();
            setResponse(result)
            return result
        } catch (error) {
            setError(error)
            return null
        } finally {
            setLoading(false)
        }
    };

    return {
        confirmCheckout, loading, error, response
    }
}
 
export default useCheckout

export const useCheckoutRedux = () => {
  const dispatch = useDispatch();
  const { loading, error, response } = useSelector((state) => state.checkout);

  const handleConfirmCheckout = useCallback(async () => {
    const resultAction = await dispatch(confirmCheckout());
    if (confirmCheckout.fulfilled.match(resultAction)) {
      return { success: true, data: resultAction.payload };
    } else {
      return { success: false, error: resultAction.payload };
    }
  }, [dispatch]);

  const resetCheckout = useCallback(() => {
    dispatch(clearCheckoutState());
  }, [dispatch]);

  return {
    confirmCheckout: handleConfirmCheckout,
    resetCheckout,
    loading,
    error,
    response,
  };
};