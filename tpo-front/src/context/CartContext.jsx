import { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartDrawer, setCartDrawer] = useState(false);

  const handleCartClick = () => {
    setCartDrawer((state) => !state);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const cartProduct = formatCartItemToAdd(product, 1);
      if (product?.cartQuantity && product.cartQuantity >= product.quantity) {
        return;
      }
      const data = await cartService.addItemToCart(cartProduct);
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const subtractToCart = async (product) => {
    try {
      if (product.cartQuantity <= 1) {
        return;
      }
      const cartProduct = formatCartItemToAdd(
        product,
        product.cartQuantity - 1
      );
      const data = await cartService.updateProduct(product.id, cartProduct);
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const removeFromCart = async (product) => {
    try {
      const data = await cartService.deleteProduct(product.id);
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const updateCart = async (product, value) => {
    try {
      if (
        product.cartQuantity <= 0 &&
        product.cartQuantity > product.quantity
      ) {
        return;
      }
      const cartProduct = formatCartItemToAdd(product, value);
      const data = await cartService.updateProduct(product.id, cartProduct);
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const getTotalPriceCart = () => {
    const total = cart.reduce((acc, product) => {
      return acc + product.cartQuantity * product.price;
    }, 0);
    return total;
  };

  const formatCartItemToAdd = (product, updateQuantity) => {
    return {
      productId: product.id,
      quantity: updateQuantity ?? product.cartQuantity,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        subtractToCart,
        removeFromCart,
        updateCart,
        cartDrawer,
        handleCartClick,
        getTotalPriceCart,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
