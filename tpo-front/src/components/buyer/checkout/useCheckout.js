import { useState } from "react"
import checkoutService from "../../../services/checkoutService"

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