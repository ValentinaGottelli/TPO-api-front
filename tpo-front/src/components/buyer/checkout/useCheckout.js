import { useState } from "react"
import checkoutService from "../../../services/checkoutService"
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { confirmCheckoutThunk } from "../../../store/slices/checkoutSlice";

export const useCheckout = () => {
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

export const useCheckoutRedux = () => {
  const dispatch = useDispatch();
  const { loading, error, response } = useSelector((state) => state.checkout);

  const confirmCheckout = useCallback(async () => {
    const resultAction = await dispatch(confirmCheckoutThunk());
    if (confirmCheckoutThunk.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      return null;
    }
  }, [dispatch]);
  
  return {
    confirmCheckout,
    loading,
    error,
    response
  };
};